import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default async function AdminDashboard() {
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayReservations, monthlyStats, totalCustomers, recentReservations] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        startTime: { gte: todayStart, lte: todayEnd },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      include: { user: true, menu: true, staff: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.reservation.aggregate({
      where: {
        startTime: { gte: thisMonthStart },
        status: "COMPLETED",
      },
      _count: true,
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.reservation.findMany({
      where: { status: "CONFIRMED" },
      include: { user: true, menu: true },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
  ]);

  // 月売上（完了した予約のメニュー合計）
  const completedThisMonth = await prisma.reservation.findMany({
    where: {
      startTime: { gte: thisMonthStart },
      status: "COMPLETED",
    },
    include: { menu: true },
  });
  const monthlyRevenue = completedThisMonth.reduce((sum, r) => sum + r.menu.price - r.pointsUsed, 0);

  const statusLabel: Record<string, string> = {
    CONFIRMED: "予約確定",
    COMPLETED: "施術完了",
    CANCELLED: "キャンセル",
    NO_SHOW: "無断キャンセル",
  };

  const statusVariant: Record<string, "confirmed" | "completed" | "cancelled" | "no_show"> = {
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    NO_SHOW: "no_show",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c2c2c]">ダッシュボード</h1>
        <p className="text-[#8a7e72] text-sm mt-1">
          {format(new Date(), "yyyy年M月d日（E）", { locale: ja })}
        </p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar size={18} className="text-[#2d6a4f]" />
              </div>
              <div>
                <p className="text-xs text-[#8a7e72]">今日の予約</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{todayReservations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-[#8a7e72]">今月売上</p>
                <p className="text-xl font-bold text-[#2c2c2c]">{formatCurrency(monthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-[#8a7e72]">今月来店数</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{monthlyStats._count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users size={18} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-[#8a7e72]">総会員数</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今日の予約一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>今日の予約</CardTitle>
            <Link href="/admin/reservations" className="text-sm text-[#2d6a4f] hover:underline">
              全て見る →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {todayReservations.length === 0 ? (
            <p className="text-[#8a7e72] text-sm text-center py-6">今日の予約はありません</p>
          ) : (
            <div className="space-y-3">
              {todayReservations.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/reservations/${r.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f5f1eb] hover:bg-[#ede8e0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[52px]">
                      <p className="text-lg font-bold text-[#2d6a4f]">
                        {format(r.startTime, "HH:mm")}
                      </p>
                      <p className="text-xs text-[#8a7e72]">{format(r.endTime, "HH:mm")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#2c2c2c]">{r.user.name}</p>
                      <p className="text-xs text-[#8a7e72]">{r.menu.name}</p>
                      {r.staff && <p className="text-xs text-[#8a7e72]">担当: {r.staff.name}</p>}
                    </div>
                  </div>
                  <Badge variant={statusVariant[r.status] ?? "secondary"}>
                    {statusLabel[r.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 直近の予約確定 */}
      {recentReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>直近の確定予約（今後5件）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentReservations.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-[#f0ebe4] last:border-0"
                >
                  <div>
                    <span className="font-medium text-[#2c2c2c]">{r.user.name}</span>
                    <span className="text-[#8a7e72] ml-2">{r.menu.name}</span>
                  </div>
                  <span className="text-[#5a4e45]">
                    {format(r.startTime, "M/d（E） HH:mm", { locale: ja })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
