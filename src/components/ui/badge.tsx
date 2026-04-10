import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-neutral-100 text-neutral-700",
        navy:      "bg-navy-50 text-navy-800",
        teal:      "bg-teal-50 text-teal-700",
        success:   "bg-teal-50 text-teal-700",
        warning:   "bg-amber-50 text-amber-800",
        danger:    "bg-red-50 text-red-700",
        purple:    "bg-purple-50 text-purple-800",
        live:      "bg-teal-500 text-white",
        soon:      "bg-amber-50 text-amber-700",
      },
      size: {
        sm: "px-1.5 py-0 text-2xs",
        default: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
