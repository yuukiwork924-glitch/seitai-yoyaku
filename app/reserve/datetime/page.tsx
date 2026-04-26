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

  // Hooks must always be called — redirect is handled via state
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
      <div className="max-w-md mx-auto p-4 space-y-4">

        {/* 日付ナビ */}
        <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              disabled={!canPrev}
            >
              <ChevronLeft size={18} />
            </Button>
            <p className="font-semibold text-[#2c2c2c]">
              {format(selectedDate, "yyyy年M月d日（E）", { locale: ja })}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* 横スクロール日付 */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 14 }, (_, i) => addDays(today, i)).map((day) => {
              const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center min-w-[44px] py-2 px-1 rounded-xl transition-colors ${
                    isSelected ? "bg-[#2d6a4f] text-white" : "hover:bg-[#f0ebe4] text-[#5a4e45]"
                  }`}
                >
                  <span className="text-[10px]">{format(day, "E", { locale: ja })}</span>
                  <span className="text-sm font-bold">{format(day, "d")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 時間スロット */}
        <div>
          <h2 className="font-semibold text-[#2c2c2c] mb-3">空き状況</h2>
          {loadingSlots ? (
            <div className="text-center py-8 text-[#8a7e72]">読み込み中...</div>
          ) : slots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8e1d9] p-6 text-center text-[#8a7e72]">
              この日は予約を受け付けていません
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.startTime}
                  onClick={() => slot.available && selectSlot(slot)}
                  disabled={!slot.available}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                    slot.available
                      ? "bg-white border border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white active:scale-95"
                      : "bg-[#f5f1eb] text-[#b8afa6] border border-transparent cursor-not-allowed"
                  }`}
                >
                  {format(new Date(slot.startTime), "HH:mm")}
                  {!slot.available && <span className="block text-[10px]">×</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
