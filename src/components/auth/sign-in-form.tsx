"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OAuthButton } from "./oauth-button";
import { EmailOtpForm } from "./email-otp-form";
import { PasswordSignInForm } from "./password-sign-in-form";

type AuthMode = "options" | "email-otp" | "password";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export function SignInForm() {
  const [mode, setMode] = useState<AuthMode>("options");

  if (mode === "email-otp") {
    return (
      <div className="flex flex-1 items-center justify-center bg-white px-16">
        <div className="w-full max-w-sm">
          <EmailOtpForm onBack={() => setMode("options")} />
        </div>
      </div>
    );
  }

  if (mode === "password") {
    return (
      <div className="flex flex-1 items-center justify-center bg-white px-16">
        <div className="w-full max-w-sm">
          <PasswordSignInForm onBack={() => setMode("options")} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-white px-16">
      <div className="w-full max-w-sm">
        <h2 className="mb-1.5 text-xl font-medium tracking-tight text-neutral-900">
          Sign in to OpusRoster
        </h2>
        <p className="mb-8 text-sm text-neutral-500">
          Continue with your work account
        </p>

        <div className="space-y-2.5">
          <OAuthButton
            provider="google"
            label="Continue with Google"
            icon={<GoogleIcon />}
          />
          <OAuthButton
            provider="azure"
            label="Continue with Microsoft"
            icon={<MicrosoftIcon />}
          />

          <div className="flex items-center gap-3 py-1">
            <Separator />
            <span className="shrink-0 text-xs text-neutral-400">or</span>
            <Separator />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3 px-4"
            onClick={() => setMode("email-otp")}
          >
            <Mail size={16} className="text-neutral-400" />
            Continue with magic link
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3 px-4"
            onClick={() => setMode("password")}
          >
            <Lock size={16} className="text-neutral-400" />
            Continue with password
          </Button>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-neutral-400">
          No credit card required · Cancel anytime
          <br />
          SOC 2 Type 2 in progress · Your data is never sold
        </p>

        <p className="mt-4 text-center text-xs text-neutral-300">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-neutral-500 transition-colors">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-neutral-500 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
