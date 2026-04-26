import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function isAdmin(session: { user?: unknown } | null) {
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const staff = await prisma.staff.findUnique({
    where: { id: params.id },
    include: { schedules: { orderBy: { date: "asc" } } },
  });
  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(staff);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const staff = await prisma.staff.update({
    where: { id: params.id },
    data: {
      name: body.name ?? undefined,
      email: body.email ?? undefined,
      bio: body.bio ?? undefined,
      isActive: body.isActive ?? undefined,
    },
  });
  return NextResponse.json(staff);
}

// シフト一括保存
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const schedules = body.schedules as Array<{
    date: string;
    startTime: string;
    endTime: string;
    isOff: boolean;
  }>;

  for (const s of schedules) {
    await prisma.staffSchedule.upsert({
      where: { staffId_date: { staffId: params.id, date: s.date } },
      update: { startTime: s.startTime, endTime: s.endTime, isOff: s.isOff },
      create: { staffId: params.id, ...s },
    });
  }

  return NextResponse.json({ ok: true });
}
