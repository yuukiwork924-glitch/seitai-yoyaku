"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function InfoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { draft, setDraft } = useReserveStore();
  const [redirected, setRedirected] = useState(false);

  const [intakeForm, setIntakeForm] = useState({
    gender: "",
    birthDate: "",
    occupation: "",
    chiefComplaint: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
  });

  useEffect(() => {
    if (!draft.menuId || !draft.date) {
      setRedirected(true);
      router.push("/reserve");
    }
  }, [draft.menuId, draft.date, router]);

  if (redirected || !draft.menuId || !draft.date) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-[#8a7e72]">リダイレクト中...</div>;
  }

  if (status === "loading") {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-[#8a7e72]">読み込み中...</div>;
  }

  const isFirstVisit = (session?.user as { isFirstVisit?: boolean })?.isFirstVisit !== false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDraft({
      isFirstVisit: !!isFirstVisit,
      usePoints: false,
      pointsToUse: 0,
    });
    router.push("/reserve/confirm");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <ReserveHeader step={4} title="お客様情報" backHref="/reserve/staff" />
      <div className="max-w-md mx-auto p-4 pb-8">

        {/* ログイン状態 */}
        {session ? (
          <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white font-bold text-sm">
              {(session.user?.name ?? "?").charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#2c2c2c]">{session.user?.name ?? ""}</p>
              <p className="text-sm text-[#8a7e72]">{session.user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-800">
            <p className="font-medium">ゲストとして進んでいます</p>
            <p className="text-xs mt-0.5 text-amber-600">確認画面でログインすると予約が確定できます</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 初回のみ問診票 */}
          {isFirstVisit ? (
            <div className="space-y-4">
              <div className="bg-[#f0f9f5] border border-[#a8d5be] rounded-xl p-3 text-sm text-[#2d6a4f]">
                <p className="font-medium">初回ご来院の方へ</p>
                <p className="text-xs mt-0.5 text-[#5a9e7a]">簡単な問診票にご記入ください（任意項目あり）</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-[#5a4e45]">生年月日</Label>
                  <Input type="date" className="mt-1 h-12" value={intakeForm.birthDate}
                    onChange={(e) => setIntakeForm(p => ({ ...p, birthDate: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#5a4e45]">性別</Label>
                  <select
                    className="flex h-12 w-full rounded-xl border border-[#e0d8cf] bg-white px-4 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    value={intakeForm.gender}
                    onChange={(e) => setIntakeForm(p => ({ ...p, gender: e.target.value }))}
                  >
                    <option value="">未選択</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">その他</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#5a4e45]">職業</Label>
                <Input className="mt-1 h-12" placeholder="会社員・主婦・学生など" value={intakeForm.occupation}
                  onChange={(e) => setIntakeForm(p => ({ ...p, occupation: e.target.value }))} />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#5a4e45]">来院の目的・お悩み <span className="text-red-500">*</span></Label>
                <Textarea className="mt-1" rows={3} placeholder="肩こり、腰痛、産後ケアなど" value={intakeForm.chiefComplaint}
                  onChange={(e) => setIntakeForm(p => ({ ...p, chiefComplaint: e.target.value }))} />
              </div>

              <div>
                <Label className="text-sm font-medium text-[#5a4e45]">既往歴・持病 <span className="text-xs text-[#8a7e72]">（任意）</span></Label>
                <Input className="mt-1 h-12" placeholder="特になし" value={intakeForm.medicalHistory}
                  onChange={(e) => setIntakeForm(p => ({ ...p, medicalHistory: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-[#5a4e45]">服薬中の薬 <span className="text-xs text-[#8a7e72]">（任意）</span></Label>
                  <Input className="mt-1 h-12" placeholder="なし" value={intakeForm.medications}
                    onChange={(e) => setIntakeForm(p => ({ ...p, medications: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#5a4e45]">アレルギー <span className="text-xs text-[#8a7e72]">（任意）</span></Label>
                  <Input className="mt-1 h-12" placeholder="なし" value={intakeForm.allergies}
                    onChange={(e) => setIntakeForm(p => ({ ...p, allergies: e.target.value }))} />
                </div>
              </div>
            </div>
          ) : (
            /* 再診の場合はシンプルに */
            <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4">
              <p className="text-sm font-medium text-[#2c2c2c] mb-1">再診のお客様</p>
              <p className="text-sm text-[#8a7e72]">カルテ情報をもとに施術いたします。お悩みの変化などはスタッフにお申し付けください。</p>
            </div>
          )}

          <Button type="submit" className="w-full h-14 text-base font-bold rounded-2xl" size="lg">
            確認画面へ進む →
          </Button>
        </form>
      </div>
    </div>
  );
}
