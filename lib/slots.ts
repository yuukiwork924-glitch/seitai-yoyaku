import { prisma } from "./db";
import { addMinutes, parseISO, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

export async function getAvailableSlots(
  date: string,     // "YYYY-MM-DD"
  menuId: string,
  staffId?: string
): Promise<TimeSlot[]> {
  const menu = await prisma.menu.findUnique({ where: { id: menuId } });
  if (!menu) return [];

  const settings = await prisma.businessSettings.findFirst();
  if (!settings) return [];

  // 休診日チェック
  const closedDay = await prisma.closedDay.findFirst({
    where: { settingsId: settings.id, date },
  });
  if (closedDay) return [];

  const dayStart = parseISO(`${date}T${settings.openTime}:00`);
  const dayEnd = parseISO(`${date}T${settings.closeTime}:00`);
  const interval = settings.slotIntervalMin;
  const duration = menu.duration;

  // 既存予約を取得
  const existingReservations = await prisma.reservation.findMany({
    where: {
      startTime: { gte: startOfDay(dayStart) },
      endTime: { lte: endOfDay(dayEnd) },
      status: { in: ["CONFIRMED"] },
      ...(staffId ? { staffId } : {}),
    },
  });

  // スタッフシフトチェック
  // シフト未設定(schedule=null)の場合は院の営業時間を適用。isOff=trueのときのみ除外。
  if (staffId) {
    const schedule = await prisma.staffSchedule.findUnique({
      where: { staffId_date: { staffId, date } },
    });
    if (schedule?.isOff) return [];
  }

  const slots: TimeSlot[] = [];
  let current = dayStart;

  while (!isAfter(addMinutes(current, duration), dayEnd)) {
    const slotEnd = addMinutes(current, duration);

    const conflictCount = existingReservations.filter((r) => {
      return (
        isBefore(r.startTime, slotEnd) && isAfter(r.endTime, current)
      );
    }).length;

    slots.push({
      startTime: new Date(current),
      endTime: new Date(slotEnd),
      available: conflictCount < settings.maxConcurrent,
    });

    current = addMinutes(current, interval);
  }

  return slots;
}
