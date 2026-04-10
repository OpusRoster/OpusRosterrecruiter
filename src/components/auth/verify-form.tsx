"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const char = value.replace(/\D/g, "").slice(-1);
      const next = [...digits];
      next[index] = char;
      setDigits(next);
      setError(null);

      if (char && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
      const next = Array(CODE_LENGTH).fill("");
      pasted.split("").forEach((ch, i) => { next[i] = ch; });
      setDigits(next);
      const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    []
  );

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (authError) {
      setError("Invalid or expired code. Please try again.");
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } else {
      router.push("/onboarding/company");
    }

    setLoading(false);
  }

  async function handleResend() {
    setResending(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({ email });
    setCountdown(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(""));
    setError(null);
    inputRefs.current[0]?.focus();
    setResending(false);
  }

  const isFilled = digits.every(Boolean);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      {/* Logo mark */}
      <div className="mb-6 flex justify-center">
        <svg width="36" height="38" viewBox="0 0 120 130" fill="none" aria-label="OpusRoster">
          <path d="M60 10C35 10 15 30 15 55C15 75 27 92 44 100L44 120L60 105L76 120L76 100C93 92 105 75 105 55C105 30 85 10 60 10Z" fill="#1D3557" />
          <path d="M60 10L105 55L76 100L76 120L60 105L60 10Z" fill="#5DCAA5" />
          <circle cx="60" cy="52" r="18" fill="white" />
        </svg>
      </div>

      <h1 className="mb-1.5 text-center text-xl font-medium tracking-tight text-neutral-900">
        Check your inbox
      </h1>
      <p className="mb-8 text-center text-sm text-neutral-500">
        {email ? (
          <>
            We sent a 6-digit code to{" "}
            <span className="font-medium text-neutral-800">{email}</span>
          </>
        ) : (
          "We sent a 6-digit code to your email"
        )}
      </p>

      {/* OTP digit inputs */}
      <div
        className="mb-6 flex justify-center gap-2"
        onPaste={handlePaste}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              "h-12 w-10 rounded-lg border text-center font-mono text-lg font-medium text-neutral-900",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1",
              error
                ? "border-red-400 bg-red-50"
                : digit
                ? "border-teal-500 bg-teal-50/30"
                : "border-neutral-200 bg-white"
            )}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && (
        <p className="mb-4 text-center text-sm text-red-600">{error}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isFilled || loading}
        loading={loading}
        onClick={handleVerify}
      >
        Verify and continue
      </Button>

      {/* Resend */}
      <div className="mt-4 text-center text-sm text-neutral-400">
        {countdown > 0 ? (
          <span>Resend code in {countdown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-teal-600 transition-colors hover:text-teal-700 disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-neutral-100 pt-4 text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
