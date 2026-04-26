import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendReservationCancelled } from "@/lib/notifications";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      staff: true,
      menu: true,
      medicalRecord: true,
      pointTransaction: true,
    },
  });

  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as { id: string }).id;
  const isAdmin = (session.user as { role: string }).role === "ADMIN";
  if (!isAdmin && reservation.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(reservation);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = (session.user as { role: string }).role === "ADMIN";
  const body = await req.json();

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: { user: true, menu: true, staff: true },
  });
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as { id: string }).id;
  if (!isAdmin && reservation.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // キャンセル処理
  if (body.status === "CANCELLED" && reservation.status === "CONFIRMED") {
    const settings = await prisma.businessSettings.findFirst();
    if (!isAdmin && settings) {
      const hoursUntil = (reservation.startTime.getTime() - Date.now()) / 3_600_000;
      if (hoursUntil < settings.cancelDeadlineHrs) {
        return NextResponse.json(
          { error: `キャンセル期限（${settings.cancelDeadlineHrs}時間前）を過ぎています` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: { status: "CANCELLED", updatedAt: new Date() },
    });

    await sendReservationCancelled({
      to: reservation.user.email,
      customerName: reservation.user.name,
      menuName: reservation.menu.name,
      staffName: reservation.staff?.name,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      reservationId: reservation.id,
    });

    return NextResponse.json(updated);
  }

  // 管理者のみ: ステータス・メモ更新
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.reservation.update({
    where: { id: params.id },
    data: {
      status: body.status ?? undefined,
      internalNote: body.internalNote ?? undefined,
      staffId: body.staffId ?? undefined,
    },
  });

  return NextResponse.json(updated);
}
