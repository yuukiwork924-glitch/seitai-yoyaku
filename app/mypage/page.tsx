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
import { Calendar, Star, History, ChevronRight, ClipboardList } from "lucide-react";
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
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white border-b border-[#E8DDD0] sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg font-bold text-[#2C1F14]">小川クリニック</Link>
          <MypageSignOut />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4 md:grid md:grid-cols-3 md:gap-6 md:items-start md:space-y-0">
        {/* 左カラム（PC）: ユーザー情報 + メニュー */}
        <div className="md:col-span-1 space-y-4">

          {/* ユーザー情報カード */}
          <div className="relative bg-gradient-to-br from-[#8C6239] to-[#C8956B] p-5 text-white overflow-hidden">
            {/* CSS radial-gradient dot pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative">
              <p className="text-xl font-bold">{user?.name ?? ""} さん</p>
              <p className="text-sm opacity-70 mb-5">{user?.email}</p>

              {/* Point display */}
              <div className="bg-white/20 px-4 py-3 inline-flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-400 flex items-center justify-center shadow">
                  <Star size={18} className="text-white fill-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">{pointBalance.toLocaleString()}</p>
                  <p className="text-xs opacity-80 mt-0.5">ポイント残高</p>
                </div>
              </div>
            </div>
          </div>

          {/* 次回の予約 */}
          {nextReservation ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-[#2C1F14]">次回のご予約</h2>
                  <Badge variant="confirmed">予約確定</Badge>
                </div>
                <div className="bg-[#F2EBE1] p-3 space-y-1">
                  <p className="font-medium text-[#2C1F14]">
                    {format(nextReservation.startTime, "M月d日（E）HH:mm", { locale: ja })}
                  </p>
                  <p className="text-sm text-[#6B5744]">{nextReservation.menu.name}</p>
                  <p className="text-sm text-[#6B5744]">
                    担当: {nextReservation.staff?.name ?? "指名なし"}
                  </p>
                  <p className="text-sm font-medium text-[#8C6239]">
                    {formatCurrency(nextReservation.menu.price)}
                  </p>
                </div>
                <CancelButton reservationId={nextReservation.id} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-[#6B5744] text-sm mb-3">予約がありません</p>
                <Link
                  href="/reserve"
                  className="inline-flex items-center gap-1 bg-[#8C6239] text-white text-sm font-medium px-4 py-2 hover:bg-[#7a5430] transition-colors"
                >
                  <Calendar size={14} />
                  予約する
                </Link>
              </CardContent>
            </Card>
          )}

          {/* クイックアクションボタン */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {[
              { href: "/reserve", label: "予約する", icon: Calendar, color: "bg-[#8C6239]", textColor: "text-[#8C6239]", lightBg: "bg-[#F2EBE1]" },
              { href: "/mypage/points", label: "ポイント履歴", icon: Star, color: "bg-amber-500", textColor: "text-amber-600", lightBg: "bg-amber-50" },
              { href: "/mypage/history", label: "予約履歴", icon: History, color: "bg-blue-500", textColor: "text-blue-600", lightBg: "bg-blue-50" },
              { href: "/reserve", label: "カルテ確認", icon: ClipboardList, color: "bg-[#6B5744]", textColor: "text-[#6B5744]", lightBg: "bg-[#F2EBE1]" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="bg-white border border-[#E8DDD0] p-4 flex items-center gap-3 hover:shadow-sm transition-all duration-200 active:scale-[0.97]"
                >
                  <div className={`w-11 h-11 ${item.lightBg} flex items-center justify-center`}>
                    <Icon size={20} className={item.textColor} />
                  </div>
                  <span className="text-sm font-medium text-[#2C1F14]">{item.label}</span>
                  <ChevronRight size={16} className="text-[#b8afa6] ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* 右カラム（PC）: 履歴 */}
        <div className="md:col-span-2 space-y-4">
          {recentReservations.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-[#2C1F14]">最近の施術</h2>
                  <Link href="/mypage/history" className="text-sm text-[#8C6239] hover:underline">
                    全て見る →
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentReservations.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-sm py-2.5 border-b border-[#F2EBE1] last:border-0">
                      <div>
                        <p className="font-medium text-[#2C1F14]">{r.menu.name}</p>
                        <p className="text-xs text-[#6B5744] mt-0.5">
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
        </div>
      </main>
    </div>
  );
}
