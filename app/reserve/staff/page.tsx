"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import type { Staff } from "@/types";

export default function StaffPage() {
  const router = useRouter();
  const { draft, setDraft } = useReserveStore();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!draft.date) {
      setRedirected(true);
      router.push("/reserve/datetime");
    }
  }, [draft.date, router]);

  useEffect(() => {
    fetch("/api/staff").then((r) => r.json()).then(setStaffList);
  }, []);

  if (redirected || !draft.date) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-[#8a7e72]">リダイレクト中...</div>;
  }

  const select = (staffId?: string, staffName?: string) => {
    setDraft({ staffId, staffName });
    router.push("/reserve/info");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <ReserveHeader step={3} title="スタッフを選んでください" backHref="/reserve/datetime" />
      <div className="max-w-md mx-auto p-4 space-y-3">
        {/* 指名なし */}
        <button
          onClick={() => select(undefined, undefined)}
          className="w-full bg-white rounded-2xl border border-[#e8e1d9] p-4 text-left hover:border-[#2d6a4f] hover:shadow-sm transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#f0ebe4] rounded-full flex items-center justify-center text-xl">
              🙆
            </div>
            <div>
              <p className="font-semibold text-[#2c2c2c]">指名なし（誰でもOK）</p>
              <p className="text-sm text-[#8a7e72]">空きスタッフが対応します</p>
            </div>
          </div>
        </button>

        {/* スタッフ一覧 */}
        {staffList.map((staff) => (
          <button
            key={staff.id}
            onClick={() => select(staff.id, staff.name)}
            className="w-full bg-white rounded-2xl border border-[#e8e1d9] p-4 text-left hover:border-[#2d6a4f] hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#a8c5a0] rounded-full flex items-center justify-center text-white font-bold">
                {staff.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[#2c2c2c]">{staff.name}</p>
                {staff.bio && <p className="text-sm text-[#8a7e72] line-clamp-2">{staff.bio}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
