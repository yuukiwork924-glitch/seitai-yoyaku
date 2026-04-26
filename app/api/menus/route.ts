import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const menus = await prisma.menu.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(menus);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const menu = await prisma.menu.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      duration: Number(body.duration),
      price: Number(body.price),
      category: body.category ?? null,
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json(menu, { status: 201 });
}
