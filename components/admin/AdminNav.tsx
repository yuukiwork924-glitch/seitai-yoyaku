"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Calendar, Users, Scissors,
  UserCheck, Settings, LogOut, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "予約管理", icon: Calendar },
  { href: "/admin/customers", label: "顧客管理", icon: Users },
  { href: "/admin/menus", label: "メニュー管理", icon: Scissors },
  { href: "/admin/staff", label: "スタッフ管理", icon: UserCheck },
  { href: "/admin/settings", label: "営業設定", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* モバイルハンバーガー */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#2d6a4f] text-white p-2 rounded-xl shadow-md"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* オーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* サイドバー */}
      <nav
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-[#e8e1d9] shadow-sm z-40",
          "transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-[#e8e1d9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2d6a4f] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">管</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#2c2c2c]">小川整体院</p>
              <p className="text-xs text-[#8a7e72]">管理パネル</p>
            </div>
          </div>
        </div>

        <div className="p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-[#2d6a4f] text-white"
                    : "text-[#5a4e45] hover:bg-[#f0ebe4]"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#8a7e72] hover:bg-[#f0ebe4] w-full transition-colors"
          >
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
      </nav>
    </>
  );
}
