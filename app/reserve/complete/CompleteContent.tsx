"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompleteContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id");
  const { reset } = useReserveStore();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-[#2d6a4f]" />
      </div>

      <h1 className="text-2xl font-bold text-[#2c2c2c] mb-2">予約が完了しました！</h1>
      <p className="text-[#8a7e72] mb-2">ご予約ありがとうございます。</p>
      <p className="text-[#8a7e72] text-sm mb-8">
        確認メールをお送りしました。<br />
        （開発中: コンソールログに出力）
      </p>

      {reservationId && (
        <p className="text-xs text-[#b8afa6] mb-8">予約ID: {reservationId}</p>
      )}

      <div className="w-full max-w-sm space-y-3">
        <Link href="/mypage">
          <Button className="w-full" size="lg">マイページで予約を確認</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" className="w-full" size="lg">トップページに戻る</Button>
        </Link>
      </div>
    </div>
  );
}
