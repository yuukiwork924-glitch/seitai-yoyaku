"use client";

import { useRouter } from "next/navigation";
import { useReserveStore } from "@/lib/reserveStore";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import ReserveHeader from "./ReserveHeader";
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
    <div className="min-h-screen bg-[#faf8f5]">
      <ReserveHeader step={1} title="メニューを選んでください" />
      <div className="max-w-md mx-auto p-4 space-y-3">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => select(menu)}
            className="w-full bg-white rounded-2xl border border-[#e8e1d9] p-4 text-left hover:border-[#2d6a4f] hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {menu.category && (
                  <span className="text-xs bg-[#f0ebe4] text-[#5a4e45] px-2 py-0.5 rounded-full">
                    {menu.category}
                  </span>
                )}
                <h3 className="font-semibold text-[#2c2c2c] mt-1">{menu.name}</h3>
                {menu.description && (
                  <p className="text-sm text-[#8a7e72] mt-0.5 line-clamp-2">{menu.description}</p>
                )}
                <p className="text-xs text-[#8a7e72] mt-1">{menu.duration}分</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <p className="font-bold text-[#2d6a4f] text-lg">{formatCurrency(menu.price)}</p>
                <ChevronRight size={18} className="text-[#b8afa6]" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
