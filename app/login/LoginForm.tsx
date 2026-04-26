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
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#2c2c2c] mb-2">ログイン</h1>
          <p className="text-[#8a7e72] text-sm mb-6">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-[#2d6a4f] hover:underline">新規登録</Link>
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>メールアドレス</Label>
              <Input type="email" className="mt-1" placeholder="example@mail.com"
                value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required autoComplete="email" />
            </div>
            <div>
              <Label>パスワード</Label>
              <Input type="password" className="mt-1" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                required autoComplete="current-password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-[#f0ebe4] rounded-xl text-xs text-[#8a7e72]">
            <p className="font-medium mb-1">デモアカウント</p>
            <p>管理者: admin@example.com / password123</p>
            <p>顧客: customer1@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
