import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPointBalance } from "@/lib/points";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function PointsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const [balance, transactions, settings] = await Promise.all([
    getPointBalance(userId),
    prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.businessSettings.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="bg-white border-b border-[#e8e1d9] sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/mypage" className="p-1 rounded-lg hover:bg-[#f0ebe4] transition-colors">
            <ArrowLeft size={20} className="text-[#5a4e45]" />
          </Link>
          <h1 className="text-lg font-bold text-[#2c2c2c]">ポイント</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 残高 */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-6 text-white text-center">
          <Star size={32} className="mx-auto mb-2" />
          <p className="text-5xl font-bold mb-1">{balance}</p>
          <p className="text-lg opacity-90">ポイント</p>
          {settings && (
            <p className="text-sm opacity-75 mt-2">
              1pt = {settings.pointToYen}円割引 · 来院1回 = {settings.pointPerVisit}pt
            </p>
          )}
        </div>

        {/* 履歴 */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-[#2c2c2c] mb-3">ポイント履歴</h2>
            {transactions.length === 0 ? (
              <p className="text-[#8a7e72] text-sm text-center py-4">履歴がありません</p>
            ) : (
              <div className="space-y-0 divide-y divide-[#f0ebe4]">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-[#2c2c2c]">{t.description}</p>
                      <p className="text-xs text-[#8a7e72]">
                        {format(t.createdAt, "yyyy/M/d HH:mm")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${t.delta > 0 ? "text-[#2d6a4f]" : "text-red-500"}`}>
                        {t.delta > 0 ? `+${t.delta}` : t.delta}pt
                      </p>
                      <p className="text-xs text-[#8a7e72]">残高: {t.balance}pt</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
