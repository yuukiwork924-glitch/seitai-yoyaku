"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays, isBefore, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import { Button } from "@/components/ui/button";

interface Slot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export default function DatetimePage() {
  const router = useRouter();
  const { draft, setDraft } = useReserveStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!draft.menuId) {
      setRedirected(true);
      router.push("/reserve");
    }
  }, [draft.menuId, router]);

  const fetchSlots = useCallback(async (date: Date) => {
    if (!draft.menuId) return;
    setLoadingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const res = await fetch(`/api/available-slots?date=${dateStr}&menuId=${draft.menuId}`);
    const data = await res.json();
    setSlots(data);
    setLoadingSlots(false);
  }, [draft.menuId]);

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const selectSlot = (slot: Slot) => {
    setDraft({
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: format(new Date(slot.startTime), "HH:mm"),
      endTime: format(new Date(slot.endTime), "HH:mm"),
    });
    router.push("/reserve/staff");
  };

  if (redirected || !draft.menuId) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-[#8a7e72]">リダイレクト中...</div>;
  }

  const today = startOfDay(new Date());
  const canPrev = !isBefore(startOfDay(selectedDate), addDays(today, 1));

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <ReserveHeader step={2} title="日時を選んでください" backHref="/reserve" />
      <div className="max-w-2xl mx-auto p-4 space-y-5">

        {/* 日付ナビ */}
        <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              disabled={!canPrev}
              className="rounded-xl"
            >
              <ChevronLeft size={18} />
            </Button>
            <p className="font-bold text-[#2c2c2c]">
              {format(selectedDate, "yyyy年M月d日（E）", { locale: ja })}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="rounded-xl"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* 横スクロール日付チップ */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {Array.from({ length: 14 }, (_, i) => addDays(today, i)).map((day) => {
              const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center min-w-[48px] py-2.5 px-2 rounded-xl transition-all duration-200 shrink-0 ${
                    isSelected
                      ? "bg-[#2d6a4f] text-white shadow-md scale-105"
                      : "hover:bg-[#f0ebe4] text-[#5a4e45]"
                  }`}
                >
                  <span className={`text-[10px] font-medium ${isSelected ? "text-white/80" : "text-[#8a7e72]"}`}>
                    {format(day, "E", { locale: ja })}
                  </span>
                  <span className="text-sm font-bold mt-0.5">{format(day, "d")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 時間スロット */}
        <div>
          <h2 className="font-bold text-[#2c2c2c] mb-3">空き状況</h2>
          {loadingSlots ? (
            <div className="text-center py-10 text-[#8a7e72]">読み込み中...</div>
          ) : slots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8e1d9] p-8 text-center text-[#8a7e72] shadow-sm">
              この日は予約を受け付けていません
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {slots.map((slot) => (
                <button
                  key={slot.startTime}
                  onClick={() => slot.available && selectSlot(slot)}
                  disabled={!slot.available}
                  className={`py-4 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    slot.available
                      ? "bg-white border border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white active:scale-[0.97] shadow-sm hover:shadow-md"
                      : "bg-[#f5f1eb] text-[#b8afa6] border border-transparent cursor-not-allowed"
                  }`}
                >
                  <span className={slot.available ? "" : "line-through"}>
                    {format(new Date(slot.startTime), "HH:mm")}
                  </span>
                  {!slot.available && (
                    <span className="block text-[10px] mt-0.5 text-[#b8afa6]">満席</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
