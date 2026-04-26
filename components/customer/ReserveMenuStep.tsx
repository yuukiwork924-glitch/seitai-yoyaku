"use client";

import { useRouter } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight, Clock } from "lucide-react";
import ReserveHeader from "./ReserveHeader";
import Link from "next/link";
import type { Menu } from "@/types";

const CATEGORY_COLOR: Record<string, string> = {
  全身: "bg-emerald-100 text-emerald-700",
  部分: "bg-blue-100 text-blue-700",
  矯正: "bg-purple-100 text-purple-700",
};

export default function ReserveMenuStep({ menus }: { menus: Menu[] }) {
  const router = useRouter();
  const { setDraft } = useReserveStore();

  const select = (menu: Menu) => {
    setDraft({
      menuId: menu.id,
      menuName: menu.name,
      menuDuration: menu.duration,
      menuPrice: menu.price,
    });
    router.push("/reserve/datetime");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <ReserveHeader step={1} title="メニューを選ぶ" />

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24">
        <p className="text-sm text-[#8a7e72] mb-4">施術メニューを1つ選んでください</p>

        <div className="space-y-3">
          {menus.map((menu, idx) => (
            <button
              key={menu.id}
              onClick={() => select(menu)}
              className="w-full bg-white rounded-2xl border border-[#e8e1d9] p-5 text-left active:scale-[0.98] active:bg-[#f5f1eb] transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* バッジ行 */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {menu.category && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[menu.category] ?? "bg-[#f0ebe4] text-[#5a4e45]"}`}>
                        {menu.category}
                      </span>
                    )}
                    {idx === 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        人気 No.1
                      </span>
                    )}
                  </div>

                  {/* メニュー名 */}
                  <h3 className="font-bold text-[#2c2c2c] text-base leading-snug">{menu.name}</h3>

                  {/* 説明 */}
                  {menu.description && (
                    <p className="text-sm text-[#8a7e72] mt-1 leading-relaxed line-clamp-2">{menu.description}</p>
                  )}

                  {/* 所要時間 */}
                  <div className="flex items-center gap-1 mt-2 text-[#8a7e72]">
                    <Clock size={12} />
                    <span className="text-xs">{menu.duration}分</span>
                  </div>
                </div>

                {/* 価格 + 矢印 */}
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  <div className="text-right">
                    <p className="font-bold text-[#2d6a4f] text-xl leading-none">{formatCurrency(menu.price)}</p>
                    <p className="text-[10px] text-[#8a7e72] mt-0.5">税込</p>
                  </div>
                  <ChevronRight size={20} className="text-[#b8afa6] ml-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 下部: ホームへ戻る */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e1d9] px-4 py-3">
        <Link href="/" className="flex items-center justify-center text-sm text-[#8a7e72] py-1">
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
