import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "1M+ candidate profiles, scored by AI",
  "AI video screening saves 40+ hours/month",
  "Client portal, offer automation, e-signature",
  "70% of Pin.com's price — 150% of the features",
] as const;

export function SignInPanel() {
  return (
    <div className="relative flex w-[480px] shrink-0 flex-col justify-center overflow-hidden bg-navy-800 px-16 py-16">
      {/* Subtle radial highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/4 translate-x-1/4 rounded-full bg-teal-500/10"
      />

      {/* Logo */}
      <div className="mb-14 flex items-center gap-3">
        <svg width="32" height="34" viewBox="0 0 120 130" fill="none" aria-label="OpusRoster logo">
          <path
            d="M60 10C35 10 15 30 15 55C15 75 27 92 44 100L44 120L60 105L76 120L76 100C93 92 105 75 105 55C105 30 85 10 60 10Z"
            fill="white"
          />
          <path d="M60 10L105 55L76 100L76 120L60 105L60 10Z" fill="#5DCAA5" />
          <circle cx="60" cy="52" r="18" fill="#1D3557" />
        </svg>
        <span className="text-lg font-medium tracking-tight text-white">
          OpusRoster
        </span>
      </div>

      {/* Headline */}
      <h1 className="mb-4 font-display text-5xl text-white leading-tight">
        Hire faster.{" "}
        <span className="text-teal-300">Let AI do the work.</span>
      </h1>

      <p className="mb-10 text-base leading-relaxed text-white/60">
        Full-funnel recruiting from sourcing to signed offer — automated and at
        70% of competitor pricing.
      </p>

      {/* Features */}
      <ul className="space-y-3">
        {FEATURES.map((feat) => (
          <li key={feat} className="flex items-start gap-3">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-teal-400"
            />
            <span className="text-sm text-white/80">{feat}</span>
          </li>
        ))}
      </ul>

      {/* Social proof */}
      <p className="mt-14 text-xs text-white/30">
        Trusted by recruiting teams at startups and agencies
      </p>
    </div>
  );
}
