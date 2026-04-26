import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#e0d8cf] bg-white px-4 py-3 text-base",
          "placeholder:text-[#b8afa6] text-[#2c2c2c]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export type { InputProps };
export { Input };
