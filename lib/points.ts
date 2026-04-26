import { prisma } from "./db";

export async function getPointBalance(userId: string): Promise<number> {
  const latest = await prisma.pointTransaction.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return latest?.balance ?? 0;
}

export async function addPoints(
  userId: string,
  reservationId: string,
  delta: number,
  description: string
): Promise<number> {
  const currentBalance = await getPointBalance(userId);
  const newBalance = currentBalance + delta;

  await prisma.pointTransaction.create({
    data: {
      userId,
      reservationId,
      delta,
      balance: newBalance,
      description,
    },
  });

  return newBalance;
}

export async function usePoints(
  userId: string,
  points: number,
  reservationId: string
): Promise<number> {
  const currentBalance = await getPointBalance(userId);
  if (currentBalance < points) throw new Error("ポイントが不足しています");

  const newBalance = currentBalance - points;
  await prisma.pointTransaction.create({
    data: {
      userId,
      reservationId,
      delta: -points,
      balance: newBalance,
      description: `ポイント使用 (${points}pt)`,
    },
  });

  return newBalance;
}
