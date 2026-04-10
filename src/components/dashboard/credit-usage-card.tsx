import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CreditUsageSummary } from "@/types";

interface CreditUsageCardProps {
  usage: CreditUsageSummary;
}

interface UsageRowProps {
  label: string;
  used: number;
  limit: number;
}

function UsageRow({ label, used, limit }: UsageRowProps) {
  const pct = Math.round((used / limit) * 100);
  const high = pct >= 80;

  return (
    <div>
      <div className="mb-1.5 flex justify-between">
        <span className="text-xs text-neutral-500">{label}</span>
        <span className={cn("font-mono text-xs font-medium", high ? "text-amber-600" : "text-neutral-700")}>
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            high ? "bg-amber-400" : "bg-teal-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function CreditUsageCard({ usage }: CreditUsageCardProps) {
  const planLabel = usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1);
  const renewalDate = new Date(usage.renewalDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-900">{planLabel} plan</p>
          <p className="text-xs text-neutral-400">Resets {renewalDate}</p>
        </div>
        <Link
          href="/settings/billing"
          className="text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          Upgrade
        </Link>
      </div>

      <div className="flex flex-col gap-3.5">
        <UsageRow
          label="Contact credits"
          used={usage.creditsLimit - usage.creditsRemaining}
          limit={usage.creditsLimit}
        />
        <UsageRow
          label="Video screens"
          used={usage.videoScreensUsed}
          limit={usage.videoScreensLimit}
        />
      </div>
    </div>
  );
}
