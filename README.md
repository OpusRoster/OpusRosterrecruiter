# OpusRoster — Phase 1 Frontend

AI-powered recruiting platform. Next.js 14 App Router · TypeScript · Tailwind CSS.

---

## Quick start

```bash
# Install dependencies
pnpm install

# Start dev server (mock mode — no backend required)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/dashboard` with full mock data.

---

## Mock mode

By default `.env.local` has empty Supabase vars. The app detects this and:

- Bypasses all auth checks (middleware no-ops)
- Serves all data from `src/lib/mock/`
- No database, no API calls

Every page is independently testable in this state.

---

## Pages to test

| Route | What to test |
|---|---|
| `/sign-in` | Layout, OAuth buttons, email OTP flow |
| `/verify` | 6-digit code input, resend timer |
| `/onboarding/company` | Company form, team size selector, logo upload |
| `/onboarding/search` | JD input, skill chips, import options |
| `/onboarding/connect` | Account connection cards, skip flow |
| `/onboarding/results` | Candidate preview, navigation to dashboard |
| `/dashboard` | KPIs, job list, pipeline summary, activity feed, credits |
| `/sourcing` | Job list index |
| `/sourcing/job_001` | Candidate cards, filter bar, shortlist/decline, detail drawer |
| `/pipeline` | Kanban board, drag-and-drop between stages |
| `/settings` | 5 tabs: org, billing, team, integrations, security |

---

## Project structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # sign-in, verify
│   ├── (onboarding)/           # 4-step onboarding
│   ├── (app)/                  # authenticated app
│   │   ├── dashboard/
│   │   ├── sourcing/[jobId]/
│   │   ├── pipeline/
│   │   └── settings/
│   ├── layout.tsx              # root layout (fonts)
│   ├── page.tsx                # root → /dashboard redirect
│   └── globals.css
│
├── components/
│   ├── ui/                     # primitives: Button, Input, Badge, Card, Avatar…
│   ├── layout/                 # AppShell, Sidebar, PageHeader
│   ├── auth/                   # SignInPanel, SignInForm, VerifyForm…
│   ├── onboarding/             # CompanyDetailsForm, FirstSearchForm…
│   ├── dashboard/              # StatCard, ActivityFeed, CreditUsageCard…
│   ├── sourcing/               # SourcingFilterBar, SourcingAiBanner
│   ├── recruiter/              # CandidateCard, CandidateDetailDrawer,
│   │                           # JobSummaryHeader, PipelineBoard, PipelineLane…
│   └── settings/               # IntegrationConnectCard, AtsModal,
│                               # OrgProfileForm, BillingPlanCard…
│
├── hooks/
│   ├── use-sourcing.ts         # all sourcing state + actions
│   └── use-pipeline.ts         # pipeline state + drag
│
├── lib/
│   ├── mock/                   # candidates, session, activity (dev only)
│   ├── supabase/               # client.ts, server.ts
│   └── utils.ts                # cn(), formatNumber, fitScoreLabel…
│
├── types/
│   └── index.ts                # all domain types
│
└── middleware.ts               # auth guard (bypassed in mock mode)
```

---

## Wiring real backend

1. Copy `.env.local.example` → `.env.local` and fill in Supabase values
2. Run the SQL migration: `infra/supabase/migrations/001_rls_policies.sql`
3. Replace `setTimeout` stubs in onboarding pages with real `fetch` / tRPC calls
4. Replace `getMockSourcingResults()` calls with real API queries
5. The `use-sourcing` and `use-pipeline` hooks already have `// TODO:` markers at every persistence point

---

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + custom design tokens
- **Auth**: Supabase Auth (Google OAuth, Microsoft OAuth, email OTP)
- **DB**: Supabase (PostgreSQL + Row Level Security)
- **State**: React hooks (no external state library)
- **Icons**: Lucide React

## Design tokens (brand)

| Token | Value | Use |
|---|---|---|
| `navy-800` | `#1D3557` | Sidebar, primary brand |
| `teal-500` | `#1D9E75` | CTA, success, fit scores |
| `teal-300` | `#5DCAA5` | Accents, sidebar highlights |
| `neutral-50` | `#F8F7F5` | App background (warm white) |

---

## Deployment (Vercel)

```bash
# Build check
pnpm build

# Deploy
vercel --prod
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.
