import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, delta, deltaPositive = true, icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white px-5 py-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">
          {label}
        </p>
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-400">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-medium tracking-tight text-neutral-900">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {delta && (
        <p className={cn("mt-1.5 text-xs", deltaPositive ? "text-teal-600" : "text-neutral-400")}>
          {delta}
        </p>
      )}
    </div>
  );
}
