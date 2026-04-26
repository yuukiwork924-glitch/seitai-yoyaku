import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-[#8a7e72]">読み込み中...</div>}>
      <LoginForm />
    </Suspense>
  );
}
