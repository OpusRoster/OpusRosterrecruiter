import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-9 w-full rounded-md border bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400",
              "border-neutral-200 transition-colors",
              "focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500",
              "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500",
              leftIcon && "pl-9",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-xs text-neutral-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
