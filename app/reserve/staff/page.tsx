"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import { Users } from "lucide-react";
import type { Staff } from "@/types";

/** Generate a consistent green-ish hue from a string */
function nameToColor(name: string): { bg: string; text: string } {
  const palette: { bg: string; text: string }[] = [
    { bg: "bg-emerald-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-green-600", text: "text-white" },
    { bg: "bg-cyan-600", text: "text-white" },
    { bg: "bg-emerald-700", text: "text-white" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

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

      <div className="max-w-2xl mx-auto px-4 pt-5 pb-8 space-y-3">
        <p className="text-sm text-[#8a7e72]">ご希望のスタッフをお選びください</p>

        {/* 指名なし */}
        <button
          onClick={() => select(undefined, undefined)}
          className="w-full bg-white rounded-2xl border-2 border-dashed border-[#d5cfc9] p-5 text-left hover:border-[#2d6a4f] hover:shadow-md transition-all duration-200 active:scale-[0.97] active:bg-[#f5f1eb]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#f0ebe4] rounded-full flex items-center justify-center shrink-0">
              <Users size={24} className="text-[#8a7e72]" />
            </div>
            <div>
              <p className="font-bold text-[#2c2c2c] text-base">指名なし（誰でもOK）</p>
              <p className="text-sm text-[#8a7e72] mt-0.5">空きのあるスタッフが対応します</p>
            </div>
          </div>
        </button>

        {/* スタッフ一覧 */}
        {staffList.map((staff) => {
          const colors = nameToColor(staff.name);
          return (
            <button
              key={staff.id}
              onClick={() => select(staff.id, staff.name)}
              className="w-full bg-white rounded-2xl border border-[#e8e1d9] p-5 text-left hover:border-[#2d6a4f] hover:shadow-md transition-all duration-200 active:scale-[0.97] active:bg-[#f5f1eb]"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center text-xl font-bold ${colors.text} shrink-0 shadow-sm`}>
                  {staff.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2c2c2c] text-base">{staff.name}</p>
                  {staff.bio && (
                    <p className="text-sm text-[#8a7e72] mt-1 leading-relaxed">{staff.bio}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
