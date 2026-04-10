import type { User, CreditUsageSummary } from "@/types";

export function getMockUser(): User {
  return {
    id: "mock-user-id",
    orgId: "mock-org-id",
    email: "alex@acmecorp.com",
    fullName: "Alex Kim",
    avatarUrl: null,
    role: "owner",
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
  };
}

export function getMockCreditUsage(): Pick<
  CreditUsageSummary,
  "creditsRemaining" | "creditsLimit" | "plan"
> {
  return {
    creditsRemaining: 373,
    creditsLimit: 500,
    plan: "starter",
  };
}
