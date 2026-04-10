import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  imageUrl?: string;
  className?: string;
}

const sizeMap = {
  xs: "h-5 w-5 text-2xs",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
  xl: "h-14 w-14 text-lg",
};

function Avatar({ initials, color = "#1D3557", size = "md", imageUrl, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={initials}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="leading-none">{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
