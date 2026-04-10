import { cn } from "@/lib/utils";

interface FieldGroupProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldGroup({ label, hint, children, className }: FieldGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-800">{label}</label>
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
      {children}
    </div>
  );
}
