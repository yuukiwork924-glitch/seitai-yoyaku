"use client";

import { useRouter } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight, Clock } from "lucide-react";
import ReserveHeader from "./ReserveHeader";
import Link from "next/link";
import type { Menu } from "@/types";

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
    <div className="min-h-screen bg-[#FAF7F2]">
      <ReserveHeader step={1} title="メニューを選ぶ" />

      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <p className="text-sm text-[#6B5744] mb-5">施術メニューを1つ選んでください</p>

        <div className="space-y-3">
          {menus.map((menu, idx) => (
            <button
              key={menu.id}
              onClick={() => select(menu)}
              className="w-full bg-white border border-[#E8DDD0] border-l-4 border-l-[#C8956B] p-5 text-left active:scale-[0.97] active:bg-[#F2EBE1] hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* バッジ行 */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {idx === 0 && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        ★ 人気 No.1
                      </span>
                    )}
                  </div>

                  {/* メニュー名 */}
                  <h3 className="font-serif font-bold text-[#2C1F14] text-base leading-snug">{menu.name}</h3>

                  {/* 説明 */}
                  {menu.description && (
                    <p className="text-sm text-[#6B5744] mt-1 leading-relaxed line-clamp-2">{menu.description}</p>
                  )}

                  {/* 所要時間 */}
                  <div className="flex items-center gap-1 mt-2 text-[#6B5744]">
                    <Clock size={12} />
                    <span className="text-xs">{menu.duration}分</span>
                  </div>
                </div>

                {/* 価格 + 矢印 */}
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  <div className="text-right">
                    <p className="font-bold text-[#8C6239] text-2xl leading-none">{formatCurrency(menu.price)}</p>
                    <p className="text-[10px] text-[#6B5744] mt-0.5">税込</p>
                  </div>
                  <ChevronRight size={20} className="text-[#b8afa6] ml-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 下部: ホームへ戻る */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DDD0] px-4 pt-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <Link href="/" className="flex items-center justify-center text-sm text-[#6B5744] py-1 hover:text-[#8C6239] transition-colors">
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
