"use client";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Organization setup", path: "/onboarding/company" },
  { label: "Describe the role",  path: "/onboarding/search" },
  { label: "Connect accounts",   path: "/onboarding/connect" },
  { label: "First candidates",   path: "/onboarding/results" },
] as const;

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex((s) => s.path === pathname);
  const step = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="flex min-h-screen">
      <div className="flex w-72 shrink-0 flex-col bg-navy-800 px-8 py-10">
        <div className="mb-12 flex items-center gap-2.5">
          <svg width="26" height="28" viewBox="0 0 120 130" fill="none">
            <path d="M60 10C35 10 15 30 15 55C15 75 27 92 44 100L44 120L60 105L76 120L76 100C93 92 105 75 105 55C105 30 85 10 60 10Z" fill="white"/>
            <path d="M60 10L105 55L76 100L76 120L60 105L60 10Z" fill="#5DCAA5"/>
            <circle cx="60" cy="52" r="18" fill="#1D3557"/>
          </svg>
          <span className="text-base font-medium text-white">OpusRoster</span>
        </div>
        <div className="flex flex-1 flex-col gap-5">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.path} className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-teal-500 text-white",
                  active && "bg-white text-navy-800",
                  !done && !active && "bg-white/10 text-white/40"
                )}>
                  {done ? <Check size={10} strokeWidth={3}/> : <span>{i + 1}</span>}
                </div>
                <span className={cn("pt-0.5 text-sm", active ? "font-medium text-white" : done ? "text-white/70" : "text-white/35")}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-white/25">First results in under 2 minutes</p>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">
        <div className="mx-auto w-full max-w-xl px-12 py-12">
          <div className="flex gap-1 mb-4">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("h-[3px] flex-1 rounded-full", i <= step ? "bg-teal-500" : "bg-neutral-200")}/>
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-6">
            Step {step + 1} of {STEPS.length}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
