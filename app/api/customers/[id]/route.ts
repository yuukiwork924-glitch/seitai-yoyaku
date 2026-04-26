import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPointBalance } from "@/lib/points";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { id: string; role: string } | undefined;

  if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = sessionUser.role === "ADMIN";
  const isSelf = sessionUser.id === params.id;

  if (!isAdmin && !isSelf) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      intakeForm: true,
      reservations: {
        include: { menu: true, staff: true, medicalRecord: true },
        orderBy: { startTime: "desc" },
      },
      pointTransactions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const pointBalance = await getPointBalance(params.id);

  return NextResponse.json({ ...user, pointBalance });
}
