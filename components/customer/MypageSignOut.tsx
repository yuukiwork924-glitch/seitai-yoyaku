"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function MypageSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-1 text-sm text-[#8a7e72] hover:text-[#2c2c2c] transition-colors"
    >
      <LogOut size={16} />
      ログアウト
    </button>
  );
}
