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
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#e8f5ee] flex items-stretch">
      {/* Left side — photo panel (PC only) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&auto=format&fit=crop"
          alt="クリニックの温かな雰囲気"
          width={600}
          height={900}
          className="absolute inset-0 w-full h-full object-cover object-center"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d6a4f]/75 to-[#1a3d2e]/60" />
        {/* Text overlay */}
        <div className="relative flex flex-col justify-end p-12 text-white">
          <Link href="/" className="block mb-auto pt-6">
            <p className="font-serif text-2xl font-bold tracking-wide">小川クリニック</p>
          </Link>
          <div>
            <h2 className="font-serif text-4xl font-bold leading-snug mb-4">
              体のことを、<br />もっと大切に。
            </h2>
            <p className="text-white/75 text-sm leading-relaxed">
              丁寧なカウンセリングで、あなたの体の声に耳を傾けます。<br />
              まずはお気軽にご相談ください。
            </p>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile header link */}
        <Link href="/" className="md:hidden text-lg font-serif font-bold text-[#2d6a4f] mb-8 self-start">
          小川クリニック
        </Link>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e8e1d9] p-10">
          {/* Top label */}
          <p className="text-xs font-medium tracking-widest text-[#2d6a4f] uppercase mb-2">Member Portal</p>

          {/* Serif heading */}
          <h1 className="font-serif text-4xl font-bold text-[#2c2c2c] mb-1">ようこそ</h1>
          <p className="text-[#8a7e72] text-sm mb-7">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-[#2d6a4f] hover:underline font-medium">新規登録</Link>
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-[#5a4e45] block mb-1.5">メールアドレス</Label>
              <Input
                type="email"
                className="rounded-xl border-[#e8e1d9] focus:border-[#2d6a4f] focus:ring-[#2d6a4f]/20 h-11"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#5a4e45] block mb-1.5">パスワード</Label>
              <Input
                type="password"
                className="rounded-xl border-[#e8e1d9] focus:border-[#2d6a4f] focus:ring-[#2d6a4f]/20 h-11"
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
              className="w-full rounded-xl bg-[#2d6a4f] hover:bg-[#245a41] active:scale-[0.97] transition-all h-12 text-base font-bold"
              size="lg"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-7 rounded-xl bg-[#1e1e1e] p-4 text-xs font-mono">
            <p className="text-[#6a9955] mb-2">{`// デモアカウント`}</p>
            <p className="text-[#9cdcfe]">管理者</p>
            <p className="text-[#ce9178]">admin@example.com</p>
            <p className="text-[#b5cea8] mb-2">password123</p>
            <p className="text-[#9cdcfe]">顧客</p>
            <p className="text-[#ce9178]">customer1@example.com</p>
            <p className="text-[#b5cea8]">password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
