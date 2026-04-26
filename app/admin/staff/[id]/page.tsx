"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format, addDays, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface DaySchedule {
  date: string;
  startTime: string;
  endTime: string;
  isOff: boolean;
}

export default function StaffSchedulePage() {
  const params = useParams<{ id: string }>();
  const [staff, setStaff] = useState<{ name: string } | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const weekStart = addDays(startOfWeek(new Date(), { locale: ja }), weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    fetch(`/api/staff/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setStaff({ name: data.name });
        const map: Record<string, DaySchedule> = {};
        for (const s of data.schedules ?? []) {
          map[s.date] = s;
        }
        setSchedules(map);
      });
  }, [params.id]);

  const getDay = (dateStr: string): DaySchedule =>
    schedules[dateStr] ?? { date: dateStr, startTime: "09:00", endTime: "18:00", isOff: false };

  const updateDay = (dateStr: string, patch: Partial<DaySchedule>) => {
    setSchedules((prev) => ({
      ...prev,
      [dateStr]: { ...getDay(dateStr), ...patch },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = weekDays.map((d) => getDay(format(d, "yyyy-MM-dd")));
    const res = await fetch(`/api/staff/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedules: data }),
    });
    setSaving(false);
    if (res.ok) setMessage("シフトを保存しました");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/staff">
          <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#2c2c2c]">
          {staff?.name ?? "..."} のシフト設定
        </h1>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">{message}</div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(weekStart, "yyyy年M月d日", { locale: ja })} 〜
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setWeekOffset(weekOffset - 1)}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setWeekOffset(weekOffset + 1)}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {weekDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const s = getDay(dateStr);
            const dayName = format(day, "E", { locale: ja });
            const isSun = day.getDay() === 0;
            return (
              <div
                key={dateStr}
                className={`flex items-center gap-3 p-3 rounded-xl ${s.isOff ? "bg-gray-50 opacity-60" : "bg-[#f5f1eb]"}`}
              >
                <div className="w-16 text-center">
                  <p className={`text-sm font-bold ${isSun ? "text-red-500" : "text-[#2c2c2c]"}`}>
                    {format(day, "M/d")}
                  </p>
                  <p className={`text-xs ${isSun ? "text-red-400" : "text-[#8a7e72]"}`}>{dayName}</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.isOff}
                    onChange={(e) => updateDay(dateStr, { isOff: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-[#5a4e45]">休み</span>
                </label>

                {!s.isOff && (
                  <>
                    <Input
                      type="time"
                      value={s.startTime}
                      onChange={(e) => updateDay(dateStr, { startTime: e.target.value })}
                      className="w-28 h-9 text-sm"
                    />
                    <span className="text-[#8a7e72]">〜</span>
                    <Input
                      type="time"
                      value={s.endTime}
                      onChange={(e) => updateDay(dateStr, { endTime: e.target.value })}
                      className="w-28 h-9 text-sm"
                    />
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "保存中..." : "この週のシフトを保存"}
      </Button>
    </div>
  );
}
