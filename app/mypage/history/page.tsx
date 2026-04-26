import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "確定", COMPLETED: "完了", CANCELLED: "キャンセル", NO_SHOW: "無断"
};
const STATUS_VARIANT: Record<string, "confirmed" | "completed" | "cancelled" | "no_show"> = {
  CONFIRMED: "confirmed", COMPLETED: "completed", CANCELLED: "cancelled", NO_SHOW: "no_show"
};

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: { menu: true, staff: true, medicalRecord: true },
    orderBy: { startTime: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="bg-white border-b border-[#e8e1d9] sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/mypage" className="p-1 rounded-lg hover:bg-[#f0ebe4] transition-colors">
            <ArrowLeft size={20} className="text-[#5a4e45]" />
          </Link>
          <h1 className="text-lg font-bold text-[#2c2c2c]">予約履歴</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-3">
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10 text-[#8a7e72]">
              予約履歴がありません
            </CardContent>
          </Card>
        ) : (
          reservations.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2c2c2c]">{r.menu.name}</p>
                    <p className="text-sm text-[#8a7e72]">
                      {format(r.startTime, "yyyy年M月d日（E）HH:mm", { locale: ja })}
                    </p>
                    <p className="text-sm text-[#5a4e45]">
                      担当: {r.staff?.name ?? "—"} · {formatCurrency(r.menu.price)}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status] ?? "secondary"}>
                    {STATUS_LABEL[r.status]}
                  </Badge>
                </div>

                {r.medicalRecord?.staffNote && (
                  <div className="bg-[#f5f1eb] rounded-xl p-3 text-xs text-[#5a4e45]">
                    <p className="font-medium mb-0.5">施術者より</p>
                    <p>{r.medicalRecord.staffNote}</p>
                    {r.medicalRecord.nextPlan && (
                      <p className="mt-1 text-[#2d6a4f]">次回: {r.medicalRecord.nextPlan}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
