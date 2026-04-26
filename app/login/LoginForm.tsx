"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <header className="bg-white border-b border-[#e8e1d9] px-4 py-3">
        <Link href="/" className="text-lg font-bold text-[#2d6a4f]">小川クリニック</Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        {/* White card */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-[#e8e1d9] p-8">
          {/* Clinic logo / name at top */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#2d6a4f] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-white font-bold text-xl">小</span>
            </div>
            <p className="text-base font-bold text-[#2d6a4f]">小川クリニック</p>
            <p className="text-xs text-[#8a7e72] mt-0.5">会員ポータル</p>
          </div>

          <h1 className="text-xl font-bold text-[#2c2c2c] mb-1">ログイン</h1>
          <p className="text-[#8a7e72] text-sm mb-5">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-[#2d6a4f] hover:underline font-medium">新規登録</Link>
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-[#5a4e45]">メールアドレス</Label>
              <Input
                type="email"
                className="mt-1 rounded-xl border-[#e8e1d9] focus:border-[#2d6a4f] focus:ring-[#2d6a4f]/20"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#5a4e45]">パスワード</Label>
              <Input
                type="password"
                className="mt-1 rounded-xl border-[#e8e1d9] focus:border-[#2d6a4f] focus:ring-[#2d6a4f]/20"
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
              className="w-full rounded-xl bg-[#2d6a4f] hover:bg-[#245a41] active:scale-[0.97] transition-all"
              size="lg"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          {/* Demo accounts — styled as code block */}
          <div className="mt-6 rounded-xl bg-[#1e1e1e] p-4 text-xs font-mono">
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
