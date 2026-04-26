import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function isAdminSession(session: { user?: unknown } | null) {
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const menu = await prisma.menu.update({
    where: { id: params.id },
    data: {
      name: body.name ?? undefined,
      description: body.description ?? undefined,
      duration: body.duration !== undefined ? Number(body.duration) : undefined,
      price: body.price !== undefined ? Number(body.price) : undefined,
      category: body.category ?? undefined,
      isActive: body.isActive ?? undefined,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    },
  });
  return NextResponse.json(menu);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.menu.update({
    where: { id: params.id },
    data: { isActive: false },
  });
  return NextResponse.json({ ok: true });
}
