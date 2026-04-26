import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-[#e0d8cf] bg-white px-4 py-3 text-base",
          "placeholder:text-[#b8afa6] text-[#2c2c2c]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]",
          "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export type { TextareaProps };
export { Textarea };
