import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingFooterActionsProps {
  onContinue: () => void;
  continueLabel?: string;
  onBack?: () => void;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
  className?: string;
}

export function OnboardingFooterActions({
  onContinue,
  continueLabel = "Continue",
  onBack,
  continueDisabled,
  continueLoading,
  skipLabel,
  onSkip,
  className,
}: OnboardingFooterActionsProps) {
  return (
    <div className={cn("flex items-center gap-3 pt-8", className)}>
      {onBack && (
        <Button variant="ghost" size="lg" onClick={onBack} className="px-0 text-neutral-400 hover:text-neutral-600">
          ← Back
        </Button>
      )}
      <div className="flex flex-1 items-center justify-end gap-3">
        {skipLabel && onSkip && (
          <Button variant="ghost" size="lg" onClick={onSkip} className="text-neutral-400 hover:text-neutral-600">
            {skipLabel}
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          disabled={continueDisabled}
          loading={continueLoading}
          className="min-w-[140px]"
        >
          {continueLabel} →
        </Button>
      </div>
    </div>
  );
}
