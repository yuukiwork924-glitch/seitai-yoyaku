import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, symptoms, treatment, staffNote, nextPlan } = body;

  const record = await prisma.medicalRecord.upsert({
    where: { reservationId: params.id },
    update: { symptoms, treatment, staffNote, nextPlan },
    create: {
      reservationId: params.id,
      userId,
      symptoms,
      treatment,
      staffNote,
      nextPlan,
    },
  });

  return NextResponse.json(record);
}
