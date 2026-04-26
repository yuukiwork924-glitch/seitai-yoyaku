import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const menuId = searchParams.get("menuId");
  const staffId = searchParams.get("staffId") ?? undefined;

  if (!date || !menuId) {
    return NextResponse.json({ error: "date and menuId are required" }, { status: 400 });
  }

  const slots = await getAvailableSlots(date, menuId, staffId);
  return NextResponse.json(slots);
}
