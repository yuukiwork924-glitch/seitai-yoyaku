"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/mypage";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-stretch">
      {/* Left side — photo panel (PC only) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop"
          alt="クリニックの温かな雰囲気"
          width={800}
          height={900}
          className="absolute inset-0 w-full h-full object-cover object-center"
          priority
        />
        {/* Cognac/terracotta overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C1F14]/70 to-[#8C6239]/50" />
        {/* Text overlay */}
        <div className="relative flex flex-col justify-end p-12 text-white">
          <Link href="/" className="block mb-auto pt-6">
            <p className="font-serif text-2xl font-bold tracking-wide">小川整体院</p>
          </Link>
          <div>
            <h2 className="font-serif text-4xl font-bold leading-snug mb-4 text-[#2C1F14]">
              体のことを、<br />もっと大切に。
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              丁寧なカウンセリングで、あなたの体の声に耳を傾けます。<br />
              まずはお気軽にご相談ください。
            </p>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile header link */}
        <Link href="/" className="md:hidden font-serif text-lg font-bold text-[#2C1F14] mb-8 self-start">
          小川整体院
        </Link>

        <div className="w-full max-w-md bg-white border border-[#E8DDD0] p-10 shadow-sm">
          {/* Top label */}
          <p className="text-xs font-medium tracking-[0.2em] text-[#C8956B] uppercase mb-2">Member Portal</p>

          {/* Serif heading */}
          <h1 className="font-serif text-4xl font-bold text-[#2C1F14] mb-1">ようこそ</h1>
          <p className="text-[#6B5744] text-sm mb-7">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-[#8C6239] hover:underline font-medium">新規登録</Link>
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 text-sm mb-5 border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-[#6B5744] block mb-1.5">メールアドレス</Label>
              <Input
                type="email"
                className="border-[#E8DDD0] focus:border-[#8C6239] focus:ring-[#8C6239]/20 h-11"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#6B5744] block mb-1.5">パスワード</Label>
              <Input
                type="password"
                className="border-[#E8DDD0] focus:border-[#8C6239] focus:ring-[#8C6239]/20 h-11"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-[#8C6239] hover:bg-[#7a5430] active:scale-[0.97] transition-all h-12 text-base font-bold"
              size="lg"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
