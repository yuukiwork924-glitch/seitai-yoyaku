import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addPoints } from "@/lib/points";
import { sendReservationConfirmed } from "@/lib/notifications";
import { addMinutes } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");
  const isAdmin = (session.user as { role: string }).role === "ADMIN";

  const where: Record<string, unknown> = {};

  if (!isAdmin) {
    where.userId = (session.user as { id: string }).id;
  } else if (userId) {
    where.userId = userId;
  }

  if (date) {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);
    where.startTime = { gte: start, lte: end };
  }

  if (status) where.status = status;

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      staff: { select: { id: true, name: true } },
      menu: true,
      medicalRecord: true,
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(reservations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { menuId, staffId, date, startTimeStr, usePoints, intakeFormData } = body;

  const userId = (session.user as { id: string }).id;

  const menu = await prisma.menu.findUnique({ where: { id: menuId } });
  if (!menu) return NextResponse.json({ error: "Menu not found" }, { status: 404 });

  const startTime = new Date(`${date}T${startTimeStr}:00`);
  const endTime = addMinutes(startTime, menu.duration);

  const settings = await prisma.businessSettings.findFirst();
  if (!settings) return NextResponse.json({ error: "Settings not found" }, { status: 500 });

  // 重複チェック
  const conflicts = await prisma.reservation.count({
    where: {
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      status: "CONFIRMED",
      ...(staffId ? { staffId } : {}),
    },
  });
  if (conflicts >= settings.maxConcurrent) {
    return NextResponse.json({ error: "この時間帯は満枠です" }, { status: 409 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let pointsUsed = 0;
  if (usePoints) {
    const { getPointBalance } = await import("@/lib/points");
    const balance = await getPointBalance(userId);
    const ptPerYen = settings.pointToYen;
    pointsUsed = Math.min(
      balance,
      Math.floor(menu.price / ptPerYen)
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      menuId,
      staffId: staffId || null,
      startTime,
      endTime,
      status: "CONFIRMED",
      isFirstVisit: user.isFirstVisit,
      pointsUsed,
    },
    include: { menu: true, staff: true, user: true },
  });

  // 初回フラグ更新
  if (user.isFirstVisit) {
    await prisma.user.update({
      where: { id: userId },
      data: { isFirstVisit: false },
    });

    // 問診票保存
    if (intakeFormData) {
      await prisma.intakeForm.upsert({
        where: { userId },
        update: intakeFormData,
        create: { userId, ...intakeFormData },
      });
    }
  }

  // ポイント使用
  if (pointsUsed > 0) {
    const { usePoints: deductPoints } = await import("@/lib/points");
    await deductPoints(userId, pointsUsed, reservation.id);
  }

  // ポイント付与（施術完了後ではなく予約確定時に付与）
  await addPoints(userId, reservation.id, settings.pointPerVisit, "予約確定ポイント");

  // メール通知（モック）
  await sendReservationConfirmed({
    to: user.email,
    customerName: user.name,
    menuName: menu.name,
    staffName: reservation.staff?.name,
    startTime,
    endTime,
    reservationId: reservation.id,
  });

  return NextResponse.json(reservation, { status: 201 });
}
