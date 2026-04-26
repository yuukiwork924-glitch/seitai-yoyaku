"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReservationWithRelations } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "確定",
  COMPLETED: "完了",
  CANCELLED: "キャンセル",
  NO_SHOW: "無断",
};

const STATUS_VARIANT: Record<string, "confirmed" | "completed" | "cancelled" | "no_show"> = {
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState<ReservationWithRelations[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(`/api/reservations?date=${dateStr}`);
      const data = await res.json();
      setReservations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate, fetchReservations]);

  const weekStart = startOfWeek(selectedDate, { locale: ja });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2c2c2c]">予約管理</h1>
      </div>

      {/* 週カレンダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 7))}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="font-medium text-[#2c2c2c]">
              {format(weekStart, "yyyy年M月", { locale: ja })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-[#2d6a4f] text-white"
                      : isToday
                      ? "bg-[#a8c5a0] text-white"
                      : "hover:bg-[#f0ebe4] text-[#5a4e45]"
                  }`}
                >
                  <span className="text-xs mb-1">
                    {format(day, "E", { locale: ja })}
                  </span>
                  <span className="text-sm font-bold">{format(day, "d")}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 予約一覧 */}
      <div>
        <h2 className="text-lg font-semibold text-[#2c2c2c] mb-3">
          {format(selectedDate, "M月d日（E）", { locale: ja })}の予約
          {!loading && (
            <span className="ml-2 text-sm font-normal text-[#8a7e72]">
              {reservations.filter((r) => r.status !== "CANCELLED").length}件
            </span>
          )}
        </h2>

        {loading ? (
          <div className="text-center py-10 text-[#8a7e72]">読み込み中...</div>
        ) : reservations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10 text-[#8a7e72]">
              この日の予約はありません
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => (
              <Link key={r.id} href={`/admin/reservations/${r.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[56px]">
                          <p className="text-xl font-bold text-[#2d6a4f]">
                            {format(new Date(r.startTime), "HH:mm")}
                          </p>
                          <p className="text-xs text-[#8a7e72]">
                            〜{format(new Date(r.endTime), "HH:mm")}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2c2c2c]">{r.user.name}</p>
                          <p className="text-sm text-[#5a4e45]">{r.menu.name}</p>
                          <p className="text-xs text-[#8a7e72]">
                            担当: {r.staff?.name ?? "未定"} /{" "}
                            {r.isFirstVisit ? "初回" : "再診"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={STATUS_VARIANT[r.status] ?? "secondary"}>
                        {STATUS_LABEL[r.status]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
