import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrgPlan } from "@/types";

interface PlanFeature {
  label: string;
}

interface BillingPlanCardProps {
  plan: OrgPlan;
  priceMonthly: number;
  features: PlanFeature[];
  isCurrent: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
}

const PLAN_LABELS: Record<OrgPlan, string> = {
  starter:      "Starter",
  professional: "Professional",
  business:     "Business",
  enterprise:   "Agency / Enterprise",
};

export function BillingPlanCard({
  plan,
  priceMonthly,
  features,
  isCurrent,
  isRecommended,
  onSelect,
}: BillingPlanCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-white px-5 py-5 transition-shadow",
        isCurrent
          ? "border-teal-400 shadow-[0_0_0_3px_theme(colors.teal.50)]"
          : isRecommended
          ? "border-navy-300"
          : "border-neutral-200"
      )}
    >
      {/* Labels */}
      {isCurrent && (
        <span className="absolute -top-3 left-4 rounded-full bg-teal-500 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-white">
          Current plan
        </span>
      )}
      {isRecommended && !isCurrent && (
        <span className="absolute -top-3 left-4 rounded-full bg-navy-800 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-white">
          Recommended
        </span>
      )}

      <p className="mb-1 text-sm font-semibold text-neutral-900">{PLAN_LABELS[plan]}</p>

      <div className="mb-4 flex items-baseline gap-1">
        {plan === "enterprise" ? (
          <span className="text-2xl font-semibold text-neutral-900">Custom</span>
        ) : (
          <>
            <span className="text-3xl font-semibold tracking-tight text-neutral-900">
              ${priceMonthly}
            </span>
            <span className="text-xs text-neutral-400">/seat/mo</span>
          </>
        )}
      </div>

      <ul className="mb-5 flex flex-1 flex-col gap-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-teal-500" />
            <span className="text-xs text-neutral-600">{f.label}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button variant="outline" size="md" disabled className="w-full">
          Current plan
        </Button>
      ) : (
        <Button
          variant={isRecommended ? "primary" : "outline"}
          size="md"
          className="w-full"
          onClick={onSelect}
        >
          {plan === "enterprise" ? "Contact sales" : "Upgrade"}
        </Button>
      )}
    </div>
  );
}
