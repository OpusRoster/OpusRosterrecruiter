"use client";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { OrgProfileForm } from "@/components/settings/org-profile-form";
import { SeatSummaryCard } from "@/components/settings/seat-summary-card";
import { BillingPlanCard } from "@/components/settings/billing-plan-card";
import { IntegrationConnectCard } from "@/components/settings/integration-connect-card";
import { AtsModal } from "@/components/settings/ats-modal";
import { Button } from "@/components/ui/button";
import { getMockUser } from "@/lib/mock/session";
import { cn } from "@/lib/utils";

type Tab = "organization" | "billing" | "team" | "integrations" | "security";
const TABS: { id: Tab; label: string }[] = [
  { id: "organization", label: "Organization" },
  { id: "billing", label: "Plan & billing" },
  { id: "team", label: "Team" },
  { id: "integrations", label: "Integrations" },
  { id: "security", label: "Security" },
];

const MOCK_ORG = { id: "mock-org-id", name: "Acme Corp", domain: "acmecorp.com", logoUrl: null, teamSize: "3-10" as const, plan: "starter" as const, creditsRemaining: 373, creditsLimit: 500, stripeCustomerId: null, createdAt: new Date().toISOString() };

const PLANS = [
  { plan: "starter" as const, priceMonthly: 69, features: [{ label: "500 credits/seat/mo" }, { label: "5 video screens/mo" }, { label: "AI sourcing + fit scoring" }, { label: "120+ ATS integrations" }] },
  { plan: "professional" as const, priceMonthly: 104, features: [{ label: "Everything in Starter" }, { label: "25 video screens/mo" }, { label: "Client portal" }, { label: "Offer + e-signature" }] },
  { plan: "business" as const, priceMonthly: 174, features: [{ label: "Everything in Pro" }, { label: "1,500 credits/seat" }, { label: "Unlimited screens" }, { label: "Internal mobility AI" }] },
  { plan: "enterprise" as const, priceMonthly: 0, features: [{ label: "White-label" }, { label: "Custom domain" }, { label: "SSO / SAML" }, { label: "Custom AI tuning" }] },
];

function SecurityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between border-b border-neutral-100 py-3 last:border-b-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-right text-sm font-medium text-neutral-800">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("organization");
  const [atsOpen, setAtsOpen] = useState(false);
  const user = getMockUser();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-neutral-200 bg-white">
        <div className="px-8 pt-5">
          <h1 className="mb-4 text-xl font-semibold tracking-tight text-neutral-900">Settings</h1>
        </div>
        <div className="flex items-end gap-0 px-8">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={cn("border-b-2 px-4 pb-3 pt-1 text-sm transition-colors", tab === t.id ? "border-navy-800 font-medium text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600")}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl space-y-5">
          {tab === "organization" && (
            <Card><CardHeader><CardTitle>Organization profile</CardTitle><CardDescription>Displayed in candidate-facing emails and your client portal.</CardDescription></CardHeader>
              <CardContent><OrgProfileForm org={MOCK_ORG} onSave={async () => { await new Promise((r) => setTimeout(r, 600)); }} /></CardContent>
            </Card>
          )}
          {tab === "billing" && (
            <div className="grid grid-cols-4 gap-3">
              {PLANS.map((p) => <BillingPlanCard key={p.plan} {...p} isCurrent={MOCK_ORG.plan === p.plan} isRecommended={p.plan === "professional"} onSelect={() => {}} />)}
            </div>
          )}
          {tab === "team" && (
            <Card><CardHeader><CardTitle>Team members</CardTitle></CardHeader>
              <CardContent><SeatSummaryCard members={[user]} seatsUsed={1} seatsTotal={1} onInvite={() => {}} /></CardContent>
            </Card>
          )}
          {tab === "integrations" && (
            <>
              <Card><CardHeader><CardTitle>Email sending</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <IntegrationConnectCard icon="📧" title="Google Workspace" description="Send outreach from Gmail." category="Email" status="disconnected" onConnect={async () => new Promise((r) => setTimeout(r, 1000))} />
                  <IntegrationConnectCard icon="📬" title="Microsoft Outlook" description="Send from Outlook or Office 365." category="Email" status="disconnected" onConnect={async () => new Promise((r) => setTimeout(r, 1000))} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>ATS integrations</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setAtsOpen(true)}>Browse all ATS</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <IntegrationConnectCard icon="🌱" title="Greenhouse" description="Bi-directional candidate sync." category="ATS" status="disconnected" onConnect={async () => new Promise((r) => setTimeout(r, 1000))} />
                  <IntegrationConnectCard icon="⚖️" title="Lever" description="Bi-directional candidate sync." category="ATS" status="disconnected" onConnect={async () => new Promise((r) => setTimeout(r, 1000))} />
                </CardContent>
              </Card>
            </>
          )}
          {tab === "security" && (
            <Card><CardHeader><CardTitle>Security &amp; compliance</CardTitle></CardHeader>
              <CardContent>
                <SecurityRow label="Data encryption" value="AES-256 at rest · TLS 1.3 in transit" />
                <SecurityRow label="Authentication" value="Passwordless OTP · Google OAuth · Microsoft OAuth" />
                <SecurityRow label="Tenant isolation" value="Row-level security at database layer" />
                <SecurityRow label="SOC 2 Type 2" value="In progress · Target Q4 2026" />
                <SecurityRow label="GDPR" value="Opt-out in every email · 72-hr deletion SLA" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {atsOpen && <AtsModal onClose={() => setAtsOpen(false)} onConnect={async () => new Promise((r) => setTimeout(r, 1000))} />}
    </div>
  );
}
