"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface EmailOtpFormProps {
  onBack: () => void;
}

export function EmailOtpForm({ onBack }: EmailOtpFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to auth server. Check your .env.local file."
      );
    }

    setLoading(false);
  }

  if (sent) {
    return (
      <div>
        <h2 className="mb-1.5 text-xl font-medium tracking-tight text-neutral-900">
          Check your inbox
        </h2>
        <p className="mb-8 text-sm text-neutral-500">
          We sent a sign-in link to{" "}
          <strong className="font-medium text-neutral-800">{email}</strong>.
          Click the link to continue.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <ArrowLeft size={14} />
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1.5 text-xl font-medium tracking-tight text-neutral-900">
        Sign in with email
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        Enter your work email and we&apos;ll send you a sign-in link. No
        password needed.
      </p>

      <div className="space-y-3">
        <Input
          type="email"
          label="Work email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          error={error ?? undefined}
          autoFocus
        />
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSend}
          loading={loading}
          disabled={!email}
        >
          Send sign-in link
        </Button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <ArrowLeft size={14} />
        Back to sign-in options
      </button>
    </div>
  );
}
