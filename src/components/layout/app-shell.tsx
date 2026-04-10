import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getUser, getUserProfile } from "@/lib/supabase/server";
import { getMockUser, getMockCreditUsage } from "@/lib/mock/session";
import type { User } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let appUser: User;
  let creditUsage;

  if (isMockMode) {
    // Mock mode — no real auth needed
    appUser = getMockUser();
    creditUsage = getMockCreditUsage();
  } else {
    // Real mode — check Supabase session
    const supabaseUser = await getUser();

    if (!supabaseUser) {
      redirect("/sign-in");
    }

    const profile = await getUserProfile();

    // Check onboarding complete
    if (!profile?.onboarding_complete || !profile?.org_id) {
      redirect("/onboarding/company");
    }

    appUser = {
      id: supabaseUser.id,
      orgId: profile?.org_id ?? null,
      email: supabaseUser.email ?? "",
      fullName: profile?.full_name ?? supabaseUser.user_metadata?.full_name ?? null,
      avatarUrl: profile?.avatar_url ?? supabaseUser.user_metadata?.avatar_url ?? null,
      role: profile?.role ?? "owner",
      onboardingComplete: profile?.onboarding_complete ?? false,
      createdAt: supabaseUser.created_at,
    };

    creditUsage = getMockCreditUsage(); // TODO: replace with real DB query
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar user={appUser} creditUsage={creditUsage} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
