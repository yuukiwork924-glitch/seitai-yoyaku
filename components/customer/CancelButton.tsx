"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelButton({ reservationId }: { reservationId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "キャンセルできませんでした");
      setConfirming(false);
      return;
    }
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
        <p className="text-sm font-medium text-red-700 mb-2">本当にキャンセルしますか？</p>
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "処理中..." : "キャンセルする"}
          </button>
          <button
            onClick={() => { setConfirming(false); setError(""); }}
            className="flex-1 bg-white border border-[#e8e1d9] text-[#5a4e45] text-sm font-medium py-2 rounded-lg"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="mt-3 w-full text-sm text-red-500 border border-red-200 py-2 rounded-xl hover:bg-red-50 transition-colors"
    >
      この予約をキャンセルする
    </button>
  );
}
