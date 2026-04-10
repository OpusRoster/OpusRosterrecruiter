"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface PasswordSignInFormProps { onBack: () => void; }

export function PasswordSignInForm({ onBack }: PasswordSignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); setLoading(false); return; }
      if (data.user) {
        const { data: profile } = await supabase.from("users").select("org_id").eq("id", data.user.id).single();
        if (!profile?.org_id) { router.push("/onboarding/company"); } else { router.push("/dashboard"); }
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect.");
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-1.5 text-xl font-medium tracking-tight text-neutral-900">Sign in</h2>
      <p className="mb-6 text-sm text-neutral-500">Enter your email and password.</p>
      <div className="space-y-3">
        <Input type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignIn()} autoFocus />
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} label="Password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignIn()} error={error ?? undefined} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600">
            {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={handleSignIn} loading={loading} disabled={!email || !password}>Sign in</Button>
      </div>
      <button onClick={onBack} className="mt-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600">
        <ArrowLeft size={14}/> Back
      </button>
    </div>
  );
}
