"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirstSearchForm, type FirstSearchData } from "@/components/onboarding/first-search-form";
import { OnboardingFooterActions } from "@/components/onboarding/onboarding-footer-actions";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingSearchPage() {
  const router = useRouter();
  const [data, setData] = useState<FirstSearchData>({ jobTitle: "", jobDescription: "", location: "", remoteOk: true, skills: [], minYearsExp: null, maxYearsExp: null, salaryMin: null, salaryMax: null });
  const [errors, setErrors] = useState<Partial<Record<keyof FirstSearchData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (!data.jobTitle.trim()) { setErrors({ jobTitle: "Job title is required." }); return; }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/sign-in"); return; }

      // Get user's org
      const { data: profile } = await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .single();

      if (!profile?.org_id) { router.push("/onboarding/company"); return; }

      // Create job
      const { error: jobError } = await supabase
        .from("jobs")
        .insert({
          org_id: profile.org_id,
          created_by: user.id,
          title: data.jobTitle,
          description: data.jobDescription,
          location: data.location,
          remote: data.remoteOk,
          skills: data.skills,
          min_years_exp: data.minYearsExp,
          status: "active",
          match_count: 11240,
        });

      if (jobError) { setError(jobError.message); setLoading(false); return; }

      router.push("/onboarding/connect");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="font-display text-3xl text-neutral-900 mb-2">Describe the role you're hiring for</h2>
      <p className="text-sm text-neutral-500 mb-8">The more detail you give, the more precisely AI can score and rank candidates.</p>
      <FirstSearchForm value={data} onChange={setData} errors={errors} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <OnboardingFooterActions onContinue={handleContinue} continueLabel="Start sourcing" continueLoading={loading} continueDisabled={loading} onBack={() => router.push("/onboarding/company")} />
    </>
  );
}
