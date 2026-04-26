import { prisma } from "@/lib/db";
import ReserveMenuStep from "@/components/customer/ReserveMenuStep";

export default async function ReservePage() {
  const menus = await prisma.menu.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ReserveMenuStep menus={menus} />;
}
