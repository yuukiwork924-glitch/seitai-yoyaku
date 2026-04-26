import { Suspense } from "react";
import CompleteContent from "./CompleteContent";

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-[#8a7e72]">完了処理中...</div>}>
      <CompleteContent />
    </Suspense>
  );
}
