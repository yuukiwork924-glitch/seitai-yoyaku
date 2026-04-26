"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { CalendarDays, Clock, User, Utensils } from "lucide-react";

export default function ConfirmPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { draft } = useReserveStore();
  const [pointBalance, setPointBalance] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!draft.menuId) {
      setRedirected(true);
      router.push("/reserve");
    }
  }, [draft.menuId, router]);

  useEffect(() => {
    const userId = (session?.user as { id: string })?.id;
    if (userId) {
      fetch(`/api/points?userId=${userId}`)
        .then((r) => r.json())
        .then((data) => setPointBalance(data.balance ?? 0));
    }
  }, [session]);

  if (redirected || !draft.menuId) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#6B5744]">リダイレクト中...</div>;
  }

  const pointToYen = 100;
  const pointDiscount = usePoints ? pointBalance * pointToYen : 0;
  const finalPrice = Math.max(0, (draft.menuPrice ?? 0) - pointDiscount);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menuId: draft.menuId,
        staffId: draft.staffId,
        date: draft.date,
        startTimeStr: draft.startTime,
        usePoints,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "予約に失敗しました");
      return;
    }

    const reservation = await res.json();
    router.push(`/reserve/complete?id=${reservation.id}`);
  };

  const summaryItems = [
    { icon: Utensils, label: "メニュー", value: draft.menuName },
    { icon: Clock, label: "施術時間", value: `${draft.menuDuration}分` },
    { icon: CalendarDays, label: "日時", value: `${draft.date} ${draft.startTime}〜${draft.endTime}` },
    { icon: User, label: "担当", value: draft.staffName ?? "指名なし" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <ReserveHeader step={5} title="予約内容の確認" backHref="/reserve/info" />
      <div className="max-w-2xl mx-auto px-4 pb-8 pt-8 space-y-4">

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
        )}

        {/* 予約サマリー */}
        <div className="bg-white border border-[#E8DDD0] overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-[#8C6239] to-[#C8956B] px-4 py-3">
            <p className="text-white font-bold text-sm">ご予約内容</p>
          </div>
          <div className="divide-y divide-[#F2EBE1]">
            {summaryItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <Icon size={16} className="text-[#8C6239] shrink-0" />
                <span className="text-sm text-[#6B5744] w-20 shrink-0">{label}</span>
                <span className="text-sm font-medium text-[#2C1F14] flex-1">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-4 bg-[#FAF7F2]">
              <span className="font-medium text-[#6B5744]">施術料金</span>
              <span className="font-bold text-[#8C6239] text-2xl">{formatCurrency(draft.menuPrice ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* ポイント使用 */}
        {pointBalance > 0 && (
          <div className="bg-white border border-[#E8DDD0] p-4 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-[#8C6239]"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
              />
              <div className="flex-1">
                <p className="font-medium text-[#2C1F14] text-sm">
                  ポイントを使う <span className="text-[#8C6239]">（残 {pointBalance}pt）</span>
                </p>
                <p className="text-xs text-[#6B5744] mt-0.5">
                  {pointBalance}pt → {formatCurrency(pointDiscount)}割引
                </p>
              </div>
            </label>
            {usePoints && (
              <div className="mt-3 bg-[#F2EBE1] px-4 py-3 flex justify-between items-center">
                <p className="text-sm text-[#6B5744]">割引後合計</p>
                <p className="text-xl font-bold text-[#8C6239]">{formatCurrency(finalPrice)}</p>
              </div>
            )}
          </div>
        )}

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800 space-y-1.5">
          <p className="font-bold">ご確認ください</p>
          <p>・当日のキャンセルはお控えください（24時間前まで無料）</p>
          <p>・料金はご来院時にお支払いください</p>
          <p>・施術完了後にポイントが付与されます（1pt）</p>
        </div>

        {/* CTA */}
        {session ? (
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full h-14 text-base font-bold rounded-none bg-[#8C6239] hover:bg-[#7a5430]"
            size="lg"
          >
            {loading ? "予約中..." : "予約を確定する ✓"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#F2EBE1] px-4 py-3 text-sm text-[#6B5744] text-center">
              予約を確定するにはログインが必要です
            </div>
            <Link href="/login?callbackUrl=/reserve/confirm">
              <Button className="w-full h-14 text-base font-bold rounded-none bg-[#8C6239] hover:bg-[#7a5430]" size="lg">
                ログインして予約する
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full h-12 rounded-none border-[#8C6239] text-[#8C6239]" size="lg">
                新規会員登録（無料）
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
