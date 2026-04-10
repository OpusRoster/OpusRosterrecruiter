"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ConnectAccountCard } from "@/components/onboarding/connect-account-card";
import { OnboardingFooterActions } from "@/components/onboarding/onboarding-footer-actions";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "outlook" | "linkedin";

export default function OnboardingConnectPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<Set<Provider>>(new Set());

  function markConnected(p: Provider) {
    return async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setConnected((prev) => new Set([...prev, p]));
    };
  }

  async function handleContinue() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Mark onboarding complete
      await supabase
        .from("users")
        .update({ onboarding_complete: true })
        .eq("id", user.id);
    }
    router.push("/onboarding/results");
  }

  return (
    <>
      <h2 className="font-display text-3xl text-neutral-900 mb-2">Connect your accounts</h2>
      <p className="text-sm text-neutral-500 mb-8">Enable personalized outreach from your inbox and LinkedIn.</p>
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">Email sending</p>
        <div className="flex flex-col gap-3">
          <ConnectAccountCard icon="📧" title="Google Workspace" description="Send outreach directly from your Gmail account." onConnect={markConnected("google")} status={connected.has("google") ? "connected" : "idle"} />
          <ConnectAccountCard icon="📬" title="Microsoft Outlook" description="Connect your Outlook or Office 365 account." onConnect={markConnected("outlook")} status={connected.has("outlook") ? "connected" : "idle"} />
        </div>
      </div>
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">LinkedIn</p>
        <ConnectAccountCard icon="💼" title="LinkedIn (Chrome extension)" description="Enables automated InMail and connection requests." badge="Chrome required" onConnect={markConnected("linkedin")} status={connected.has("linkedin") ? "connected" : "idle"} />
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 mb-2">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-teal-500" />
        <p className="text-sm text-neutral-500"><span className="font-medium text-neutral-700">Your credentials are never stored.</span> You can disconnect any account from Settings at any time.</p>
      </div>
      <OnboardingFooterActions
        onContinue={handleContinue}
        continueLabel="Continue"
        skipLabel="Skip for now"
        onSkip={handleContinue}
        onBack={() => router.push("/onboarding/search")}
      />
    </>
  );
}
