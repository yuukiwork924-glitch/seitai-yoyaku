"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (form.password.length < 8) {
      setError("パスワードは8文字以上で設定してください");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "登録に失敗しました");
      setLoading(false);
      return;
    }

    // 自動ログイン
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push("/mypage");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <header className="bg-white border-b border-[#e8e1d9] px-4 py-3">
        <Link href="/" className="text-lg font-bold text-[#2d6a4f]">小川整体院</Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#2c2c2c] mb-2">新規会員登録</h1>
          <p className="text-[#8a7e72] text-sm mb-6">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-[#2d6a4f] hover:underline">ログイン</Link>
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>お名前 *</Label>
              <Input className="mt-1" placeholder="山田 花子" value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label>メールアドレス *</Label>
              <Input type="email" className="mt-1" placeholder="example@mail.com" value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <Label>電話番号</Label>
              <Input type="tel" className="mt-1" placeholder="090-0000-0000" value={form.phone}
                onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label>パスワード *（8文字以上）</Label>
              <Input type="password" className="mt-1" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <div>
              <Label>パスワード（確認） *</Label>
              <Input type="password" className="mt-1" placeholder="••••••••" value={form.confirm}
                onChange={(e) => setForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "登録中..." : "会員登録する"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
