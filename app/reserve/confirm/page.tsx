"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function ConfirmPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { draft } = useReserveStore();
  const [pointBalance, setPointBalance] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = (session?.user as { id: string })?.id;
    if (userId) {
      fetch(`/api/points?userId=${userId}`)
        .then((r) => r.json())
        .then((data) => setPointBalance(data.balance ?? 0));
    }
  }, [session]);

  if (!draft.menuId) {
    if (typeof window !== "undefined") router.push("/reserve");
    return null;
  }

  const settings = { pointToYen: 100 };
  const pointDiscount = usePoints ? pointBalance * settings.pointToYen : 0;
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

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <ReserveHeader step={5} title="予約内容の確認" backHref="/reserve/info" />
      <div className="max-w-md mx-auto p-4 space-y-4">

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {/* 予約サマリー */}
        <div className="bg-white rounded-2xl border border-[#e8e1d9] divide-y divide-[#f0ebe4]">
          {[
            ["メニュー", draft.menuName],
            ["施術時間", `${draft.menuDuration}分`],
            ["日時", `${draft.date} ${draft.startTime} 〜 ${draft.endTime}`],
            ["担当スタッフ", draft.staffName ?? "指名なし"],
            ["区分", draft.isFirstVisit ? "初回" : "再診"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-[#8a7e72]">{label}</span>
              <span className="font-medium text-[#2c2c2c]">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-[#8a7e72]">料金</span>
            <span className="font-bold text-[#2d6a4f] text-lg">{formatCurrency(draft.menuPrice ?? 0)}</span>
          </div>
        </div>

        {/* ポイント使用 */}
        {pointBalance > 0 && (
          <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-[#2d6a4f]"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
              />
              <div>
                <p className="font-medium text-[#2c2c2c]">
                  ポイントを使用する（残高: {pointBalance}pt）
                </p>
                <p className="text-sm text-[#8a7e72]">
                  {pointBalance}pt使用 → {formatCurrency(pointDiscount)}割引
                </p>
              </div>
            </label>
            {usePoints && (
              <div className="mt-3 text-right">
                <p className="text-xs text-[#8a7e72]">割引後合計</p>
                <p className="text-xl font-bold text-[#2d6a4f]">{formatCurrency(finalPrice)}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-[#f0ebe4] rounded-xl p-4 text-sm text-[#5a4e45] space-y-1">
          <p className="font-medium">ご確認ください</p>
          <p>・当日のキャンセルはお控えください</p>
          <p>・来院時に料金をお支払いください</p>
          <p>・ポイントは予約確定時に付与されます</p>
        </div>

        {session ? (
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "予約中..." : "予約を確定する"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#f0ebe4] rounded-xl px-4 py-3 text-sm text-[#5a4e45] text-center">
              予約を確定するにはログインが必要です
            </div>
            <Link href="/login?callbackUrl=/reserve/confirm">
              <Button className="w-full" size="lg">
                ログインして予約を確定する
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full" size="lg">
                新規会員登録（無料）
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
