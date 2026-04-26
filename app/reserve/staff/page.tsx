"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import ReserveHeader from "@/components/customer/ReserveHeader";
import { Users } from "lucide-react";
import type { Staff } from "@/types";

/** Generate a consistent cognac/terracotta hue from a string */
function nameToColor(name: string): { bg: string; text: string } {
  const palette: { bg: string; text: string }[] = [
    { bg: "bg-[#8C6239]", text: "text-white" },
    { bg: "bg-[#C8956B]", text: "text-white" },
    { bg: "bg-[#D4A882]", text: "text-white" },
    { bg: "bg-[#7a5430]", text: "text-white" },
    { bg: "bg-[#a07048]", text: "text-white" },
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
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#6B5744]">リダイレクト中...</div>;
  }

  const select = (staffId?: string, staffName?: string) => {
    setDraft({ staffId, staffName });
    router.push("/reserve/info");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <ReserveHeader step={3} title="スタッフを選んでください" backHref="/reserve/datetime" />

      <div className="max-w-2xl mx-auto px-4 pt-5 pb-8 space-y-3">
        <p className="text-sm text-[#6B5744]">ご希望のスタッフをお選びください</p>

        {/* 指名なし */}
        <button
          onClick={() => select(undefined, undefined)}
          className="w-full bg-white border-2 border-dashed border-[#E8DDD0] p-5 text-left hover:border-[#8C6239] hover:shadow-sm transition-all duration-200 active:scale-[0.97] active:bg-[#F2EBE1]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#F2EBE1] rounded-full flex items-center justify-center shrink-0">
              <Users size={24} className="text-[#6B5744]" />
            </div>
            <div>
              <p className="font-bold text-[#2C1F14] text-base">指名なし（誰でもOK）</p>
              <p className="text-sm text-[#6B5744] mt-0.5">空きのあるスタッフが対応します</p>
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
              className="w-full bg-white border border-[#E8DDD0] p-5 text-left hover:border-[#8C6239] hover:shadow-sm transition-all duration-200 active:scale-[0.97] active:bg-[#F2EBE1]"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center text-xl font-bold ${colors.text} shrink-0 shadow-sm`}>
                  {staff.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2C1F14] text-base">{staff.name}</p>
                  {staff.bio && (
                    <p className="text-sm text-[#6B5744] mt-1 leading-relaxed">{staff.bio}</p>
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
