"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface OAuthButtonProps {
  provider: "google" | "azure";
  label: string;
  icon: React.ReactNode;
}

export function OAuthButton({ provider, label, icon }: OAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full justify-start gap-3 px-4"
      loading={loading}
      onClick={handleClick}
    >
      {!loading && icon}
      {label}
    </Button>
  );
}
