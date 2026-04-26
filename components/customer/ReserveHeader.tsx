import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

interface Props {
  step: number;
  totalSteps?: number;
  backHref?: string;
  title: string;
}

const STEPS = ["メニュー", "日時", "スタッフ", "情報", "確認"];

export default function ReserveHeader({ step, totalSteps = 5, backHref, title }: Props) {
  const steps = STEPS.slice(0, totalSteps);

  return (
    <div className="bg-white border-b border-[#E8DDD0] sticky top-0 z-20">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Back arrow + title */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={backHref ?? "/"}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F2EBE1] transition-colors active:scale-[0.97]"
          >
            <ArrowLeft size={20} className="text-[#6B5744]" />
          </Link>
          <h1 className="text-base font-bold text-[#2C1F14]">{title}</h1>
        </div>

        {/* Numbered step indicators */}
        <div className="flex items-start">
          {steps.map((label, i) => {
            const idx = i + 1;
            const isCompleted = idx < step;
            const isCurrent = idx === step;
            const isFuture = idx > step;

            return (
              <div key={i} className="flex items-start flex-1">
                {/* Circle + label */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-[#8C6239] text-white"
                        : isCurrent
                        ? "bg-[#8C6239] text-white ring-4 ring-[#C8956B]/30"
                        : "border-2 border-[#E8DDD0] text-[#b8afa6] bg-white"
                    }`}
                  >
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : idx}
                  </div>
                  <p
                    className={`text-[10px] mt-1 text-center leading-tight ${
                      isFuture ? "text-[#b8afa6]" : "text-[#8C6239] font-medium"
                    }`}
                  >
                    {label}
                  </p>
                </div>

                {/* Connecting line (not after last step) */}
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[1.5px] mt-[13px] mx-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? "bg-[#8C6239]" : "bg-[#E8DDD0]"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
