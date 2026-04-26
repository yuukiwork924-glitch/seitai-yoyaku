import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  step: number;
  totalSteps?: number;
  backHref?: string;
  title: string;
}

const STEPS = ["メニュー", "日時", "スタッフ", "情報", "確認"];

export default function ReserveHeader({ step, totalSteps = 5, backHref, title }: Props) {
  return (
    <div className="bg-white border-b border-[#e8e1d9] sticky top-0 z-20">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          {backHref ? (
            <Link href={backHref} className="p-1 rounded-lg hover:bg-[#f0ebe4] transition-colors">
              <ArrowLeft size={20} className="text-[#5a4e45]" />
            </Link>
          ) : (
            <Link href="/" className="p-1 rounded-lg hover:bg-[#f0ebe4] transition-colors">
              <ArrowLeft size={20} className="text-[#5a4e45]" />
            </Link>
          )}
          <h1 className="text-lg font-bold text-[#2c2c2c]">{title}</h1>
        </div>
        <div className="flex gap-1">
          {STEPS.slice(0, totalSteps).map((label, i) => (
            <div key={i} className="flex-1">
              <div
                className={`h-1 rounded-full ${i < step ? "bg-[#2d6a4f]" : i === step - 1 ? "bg-[#a8c5a0]" : "bg-[#e8e1d9]"}`}
              />
              <p className={`text-center text-[10px] mt-0.5 ${i < step ? "text-[#2d6a4f]" : "text-[#b8afa6]"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
