import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.businessSettings.findFirst({
    include: { closedDays: { orderBy: { date: "asc" } } },
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const existing = await prisma.businessSettings.findFirst();

  if (!existing) {
    const settings = await prisma.businessSettings.create({ data: body });
    return NextResponse.json(settings);
  }

  const { closedDays, ...settingsData } = body;

  await prisma.businessSettings.update({
    where: { id: existing.id },
    data: settingsData,
  });

  if (closedDays !== undefined) {
    // 休診日を全置換
    await prisma.closedDay.deleteMany({ where: { settingsId: existing.id } });
    if (closedDays.length > 0) {
      await prisma.closedDay.createMany({
        data: closedDays.map((d: { date: string; reason?: string }) => ({
          settingsId: existing.id,
          date: d.date,
          reason: d.reason ?? null,
        })),
      });
    }
  }

  const updated = await prisma.businessSettings.findFirst({
    include: { closedDays: { orderBy: { date: "asc" } } },
  });

  return NextResponse.json(updated);
}
