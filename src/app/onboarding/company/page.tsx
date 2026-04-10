"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyDetailsForm, type CompanyDetailsData } from "@/components/onboarding/company-details-form";
import { OnboardingFooterActions } from "@/components/onboarding/onboarding-footer-actions";
import { createClient } from "@/lib/supabase/client";

function validate(data: CompanyDetailsData) {
  const errors: Partial<Record<keyof CompanyDetailsData, string>> = {};
  if (!data.name.trim()) errors.name = "Company name is required.";
  if (!data.domain.trim()) errors.domain = "Company domain is required.";
  if (!data.teamSize) errors.teamSize = "Please select your team size.";
  return errors;
}

export default function OnboardingCompanyPage() {
  const router = useRouter();
  const [data, setData] = useState<CompanyDetailsData>({ name: "", domain: "", teamSize: null, logoFile: null });
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyDetailsData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    const v = validate(data);
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/sign-in"); return; }

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name: data.name, domain: data.domain, team_size: data.teamSize })
        .select("id")
        .single();

      if (orgError) { setError(orgError.message); setLoading(false); return; }

      // Link user to org
      const { error: userError } = await supabase
        .from("users")
        .update({ org_id: org.id })
        .eq("id", user.id);

      if (userError) { setError(userError.message); setLoading(false); return; }

      router.push("/onboarding/search");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="font-display text-3xl text-neutral-900 mb-2">Set up your organization</h2>
      <p className="text-sm text-neutral-500 mb-8">Tell us about your company so we can tailor your sourcing experience.</p>
      <CompanyDetailsForm value={data} onChange={setData} errors={errors} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <OnboardingFooterActions onContinue={handleContinue} continueLoading={loading} continueDisabled={loading} />
    </>
  );
}
