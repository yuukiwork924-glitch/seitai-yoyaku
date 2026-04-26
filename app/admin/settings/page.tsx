"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Settings {
  clinicName: string;
  openTime: string;
  closeTime: string;
  slotIntervalMin: number;
  maxConcurrent: number;
  cancelDeadlineHrs: number;
  pointPerVisit: number;
  pointToYen: number;
  address: string;
  phone: string;
  description: string;
  closedDays: Array<{ date: string; reason?: string }>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [calMonth, setCalMonth] = useState(new Date());

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      setSettings(await res.json());
      setMessage("設定を保存しました");
    }
  };

  const toggleClosedDay = (dateStr: string) => {
    if (!settings) return;
    const exists = settings.closedDays.find((d) => d.date === dateStr);
    setSettings({
      ...settings,
      closedDays: exists
        ? settings.closedDays.filter((d) => d.date !== dateStr)
        : [...settings.closedDays, { date: dateStr, reason: "休診日" }],
    });
  };

  if (!settings) return <div className="text-center py-20 text-[#8a7e72]">読み込み中...</div>;

  const monthDays = eachDayOfInterval({
    start: startOfMonth(calMonth),
    end: endOfMonth(calMonth),
  });
  const monthStart = startOfMonth(calMonth);
  const firstDayOfWeek = monthStart.getDay();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#2c2c2c]">営業設定</h1>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">{message}</div>
      )}

      {/* 基本情報 */}
      <Card>
        <CardHeader><CardTitle>院の基本情報</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>院名</Label>
            <Input className="mt-1" value={settings.clinicName}
              onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })} />
          </div>
          <div>
            <Label>住所</Label>
            <Input className="mt-1" value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
          </div>
          <div>
            <Label>電話番号</Label>
            <Input className="mt-1" value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </div>
          <div>
            <Label>院の紹介文</Label>
            <Input className="mt-1" value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* 営業時間・予約設定 */}
      <Card>
        <CardHeader><CardTitle>営業時間・予約設定</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>開院時間</Label>
              <Input type="time" className="mt-1" value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })} />
            </div>
            <div>
              <Label>閉院時間</Label>
              <Input type="time" className="mt-1" value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>予約間隔（分）</Label>
              <Input type="number" className="mt-1" value={settings.slotIntervalMin}
                onChange={(e) => setSettings({ ...settings, slotIntervalMin: Number(e.target.value) })} />
            </div>
            <div>
              <Label>同時受付可能数</Label>
              <Input type="number" className="mt-1" value={settings.maxConcurrent}
                onChange={(e) => setSettings({ ...settings, maxConcurrent: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>キャンセル期限（施術何時間前まで）</Label>
            <Input type="number" className="mt-1" value={settings.cancelDeadlineHrs}
              onChange={(e) => setSettings({ ...settings, cancelDeadlineHrs: Number(e.target.value) })} />
          </div>
        </CardContent>
      </Card>

      {/* ポイント設定 */}
      <Card>
        <CardHeader><CardTitle>ポイント設定</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div>
            <Label>来院1回のポイント付与数</Label>
            <Input type="number" className="mt-1" value={settings.pointPerVisit}
              onChange={(e) => setSettings({ ...settings, pointPerVisit: Number(e.target.value) })} />
          </div>
          <div>
            <Label>1ポイント = 何円割引</Label>
            <Input type="number" className="mt-1" value={settings.pointToYen}
              onChange={(e) => setSettings({ ...settings, pointToYen: Number(e.target.value) })} />
          </div>
        </CardContent>
      </Card>

      {/* 休診日カレンダー */}
      <Card>
        <CardHeader>
          <CardTitle>休診日設定</CardTitle>
          <p className="text-sm text-[#8a7e72]">日付をタップして休診日に設定/解除できます</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => setCalMonth(subMonths(calMonth, 1))}>
              <ChevronLeft size={16} />
            </Button>
            <span className="font-medium">{format(calMonth, "yyyy年M月", { locale: ja })}</span>
            <Button variant="ghost" size="icon" onClick={() => setCalMonth(addMonths(calMonth, 1))}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
              <div key={d} className="text-xs font-medium text-[#8a7e72] py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const isClosed = settings.closedDays.some((d) => d.date === dateStr);
              const isSun = day.getDay() === 0;
              return (
                <button
                  key={dateStr}
                  onClick={() => toggleClosedDay(dateStr)}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                    isClosed
                      ? "bg-red-100 text-red-600 font-medium"
                      : isSun
                      ? "text-red-400 hover:bg-red-50"
                      : "hover:bg-[#f0ebe4] text-[#2c2c2c]"
                  }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {settings.closedDays
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((d) => (
                <span key={d.date} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {format(new Date(d.date + "T00:00:00"), "M/d")}
                </span>
              ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
        {saving ? "保存中..." : "設定を保存する"}
      </Button>
    </div>
  );
}
