"use client";

import { useState } from "react";
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

  const [intakeForm, setIntakeForm] = useState({
    gender: "",
    birthDate: "",
    occupation: "",
    chiefComplaint: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
  });

  if (!draft.menuId || !draft.date) {
    if (typeof window !== "undefined") router.push("/reserve");
    return null;
  }

  if (status === "loading") return <div className="text-center py-20 text-[#8a7e72]">読み込み中...</div>;

  const isFirstVisit = session?.user && !(session.user as { isFirstVisit?: boolean }).isFirstVisit === false;

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
      <div className="max-w-md mx-auto p-4">
        {session ? (
          <div className="bg-white rounded-2xl border border-[#e8e1d9] p-4 mb-4">
            <p className="font-semibold text-[#2c2c2c]">{(session.user as { name: string })?.name ?? ""}</p>
            <p className="text-sm text-[#8a7e72]">{session.user?.email}</p>
          </div>
        ) : (
          <div className="bg-[#fff8f0] border border-[#f0ebe4] rounded-2xl p-4 mb-4 text-sm text-[#5a4e45]">
            <span className="font-medium">ゲストとして閲覧中</span>
            <span className="text-[#8a7e72]"> — 確認画面でログインすると予約が確定できます</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 初回の場合は問診票を表示 */}
          <div className="space-y-4">
            <div className="bg-[#f0ebe4] rounded-xl p-3 text-sm text-[#5a4e45]">
              初回の方は問診票のご入力をお願いします（任意項目あり）
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>生年月日</Label>
                <Input type="date" className="mt-1" value={intakeForm.birthDate}
                  onChange={(e) => setIntakeForm(p => ({ ...p, birthDate: e.target.value }))} />
              </div>
              <div>
                <Label>性別</Label>
                <select
                  className="flex h-12 w-full rounded-xl border border-[#e0d8cf] bg-white px-4 py-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
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
              <Label>職業</Label>
              <Input className="mt-1" placeholder="会社員・主婦・学生など" value={intakeForm.occupation}
                onChange={(e) => setIntakeForm(p => ({ ...p, occupation: e.target.value }))} />
            </div>

            <div>
              <Label>来院の目的・お悩み *</Label>
              <Textarea className="mt-1" placeholder="肩こり、腰痛、産後ケアなど" value={intakeForm.chiefComplaint}
                onChange={(e) => setIntakeForm(p => ({ ...p, chiefComplaint: e.target.value }))} />
            </div>

            <div>
              <Label>既往歴・持病</Label>
              <Input className="mt-1" placeholder="特になし" value={intakeForm.medicalHistory}
                onChange={(e) => setIntakeForm(p => ({ ...p, medicalHistory: e.target.value }))} />
            </div>

            <div>
              <Label>服薬中の薬</Label>
              <Input className="mt-1" placeholder="なし" value={intakeForm.medications}
                onChange={(e) => setIntakeForm(p => ({ ...p, medications: e.target.value }))} />
            </div>

            <div>
              <Label>アレルギー</Label>
              <Input className="mt-1" placeholder="なし" value={intakeForm.allergies}
                onChange={(e) => setIntakeForm(p => ({ ...p, allergies: e.target.value }))} />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            確認画面へ進む
          </Button>
        </form>
      </div>
    </div>
  );
}
