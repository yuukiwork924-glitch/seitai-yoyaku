import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPointBalance } from "@/lib/points";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, History, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import MypageSignOut from "@/components/customer/MypageSignOut";
import CancelButton from "@/components/customer/CancelButton";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "予約確定", COMPLETED: "施術完了", CANCELLED: "キャンセル", NO_SHOW: "無断キャンセル"
};
const STATUS_VARIANT: Record<string, "confirmed" | "completed" | "cancelled" | "no_show"> = {
  CONFIRMED: "confirmed", COMPLETED: "completed", CANCELLED: "cancelled", NO_SHOW: "no_show"
};

export default async function MypagePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/mypage");

  const userId = (session.user as { id: string }).id;

  const [user, pointBalance, nextReservation, recentReservations] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
    getPointBalance(userId),
    prisma.reservation.findFirst({
      where: { userId, status: "CONFIRMED", startTime: { gte: new Date() } },
      include: { menu: true, staff: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.reservation.findMany({
      where: { userId, status: { in: ["COMPLETED", "CANCELLED"] } },
      include: { menu: true },
      orderBy: { startTime: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="bg-white border-b border-[#e8e1d9] sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[#2d6a4f]">小川クリニック</Link>
          <MypageSignOut />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* ユーザー情報 */}
        <div className="bg-gradient-to-br from-[#2d6a4f] to-[#3d8a6a] rounded-2xl p-5 text-white">
          <p className="text-lg font-bold">{user?.name ?? ""} さん</p>
          <p className="text-sm opacity-80 mb-4">{user?.email}</p>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 w-fit">
            <Star size={16} className="text-yellow-300" />
            <span className="font-bold text-lg">{pointBalance}</span>
            <span className="text-sm opacity-80">ポイント</span>
          </div>
        </div>

        {/* 次回の予約 */}
        {nextReservation ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[#2c2c2c]">次回のご予約</h2>
                <Badge variant="confirmed">予約確定</Badge>
              </div>
              <div className="bg-[#f5f1eb] rounded-xl p-3 space-y-1">
                <p className="font-medium text-[#2c2c2c]">
                  {format(nextReservation.startTime, "M月d日（E）HH:mm", { locale: ja })}
                </p>
                <p className="text-sm text-[#5a4e45]">{nextReservation.menu.name}</p>
                <p className="text-sm text-[#8a7e72]">
                  担当: {nextReservation.staff?.name ?? "指名なし"}
                </p>
                <p className="text-sm font-medium text-[#2d6a4f]">
                  {formatCurrency(nextReservation.menu.price)}
                </p>
              </div>
              <CancelButton reservationId={nextReservation.id} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-[#8a7e72] text-sm mb-3">予約がありません</p>
              <Link
                href="/reserve"
                className="inline-flex items-center gap-1 bg-[#2d6a4f] text-white text-sm font-medium px-4 py-2 rounded-xl"
              >
                <Calendar size={14} />
                予約する
              </Link>
            </CardContent>
          </Card>
        )}

        {/* メニュー */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/reserve", label: "予約する", icon: Calendar, color: "bg-[#2d6a4f]" },
            { href: "/mypage/points", label: "ポイント履歴", icon: Star, color: "bg-amber-500" },
            { href: "/mypage/history", label: "予約履歴", icon: History, color: "bg-blue-500" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl border border-[#e8e1d9] p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
              >
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium text-[#2c2c2c]">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/reserve"
            className="bg-white rounded-2xl border border-[#e8e1d9] p-4 flex items-center gap-3 hover:shadow-sm transition-shadow col-span-1"
          >
            <div className="w-10 h-10 bg-[#8a7e72] rounded-xl flex items-center justify-center">
              <ChevronRight size={18} className="text-white" />
            </div>
            <span className="text-sm font-medium text-[#2c2c2c]">カルテ確認</span>
          </Link>
        </div>

        {/* 直近の履歴 */}
        {recentReservations.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[#2c2c2c]">最近の施術</h2>
                <Link href="/mypage/history" className="text-sm text-[#2d6a4f] hover:underline">
                  全て見る →
                </Link>
              </div>
              <div className="space-y-2">
                {recentReservations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm py-2 border-b border-[#f0ebe4] last:border-0">
                    <div>
                      <p className="font-medium text-[#2c2c2c]">{r.menu.name}</p>
                      <p className="text-xs text-[#8a7e72]">
                        {format(r.startTime, "yyyy/M/d（E）", { locale: ja })}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[r.status] ?? "secondary"} className="text-xs">
                      {STATUS_LABEL[r.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
