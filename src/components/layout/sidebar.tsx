"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Columns,
  Mail,
  Zap,
  Video,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Send,
  UserCheck,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { User, CreditUsageSummary } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: { label: string; variant: "live" | "soon" | "danger" | "warning" };
  exact?: boolean;
}

interface SourcingJob {
  id: string;
  title: string;
}

const NAV_PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} />, exact: true },
];

const NAV_AUTOPILOT: NavItem[] = [
  { href: "/agents",    label: "AI Agents",       icon: <Zap size={15} />,       badge: { label: "Soon", variant: "soon" } },
  { href: "/screening", label: "Video Screening",  icon: <Video size={15} />,     badge: { label: "Soon", variant: "soon" } },
  { href: "/portal",    label: "Client Portal",    icon: <Users size={15} />,     badge: { label: "Soon", variant: "soon" } },
  { href: "/analytics", label: "Analytics",        icon: <BarChart2 size={15} />, badge: { label: "Soon", variant: "soon" } },
];

const SOURCING_STAGES = [
  { label: "Shortlisted",    count: 0 },
  { label: "Manually Added", count: 0 },
  { label: "Approved",       count: 0 },
  { label: "Declined",       count: 0 },
];

function SidebarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "bg-white/[0.12] font-medium text-white"
          : "text-white/60 hover:bg-white/[0.06] hover:text-white/85"
      )}
    >
      <span className={cn("shrink-0", active ? "opacity-100" : "opacity-70")}>
        {item.icon}
      </span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <Badge variant={item.badge.variant} size="sm">{item.badge.label}</Badge>
      )}
    </Link>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 px-2.5 pt-3 text-2xs font-semibold uppercase tracking-widest text-white/30">
        {label}
      </p>
      <nav className="flex flex-col gap-0.5">{children}</nav>
    </div>
  );
}

function SourcingNav({ jobs }: { jobs: SourcingJob[] }) {
  const pathname = usePathname();
  const sourcingActive = pathname.startsWith("/sourcing");

  return (
    <div>
      <Link
        href="/sourcing"
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          sourcingActive
            ? "bg-white/[0.12] font-medium text-white"
            : "text-white/60 hover:bg-white/[0.06] hover:text-white/85"
        )}
      >
        <span className={cn("shrink-0", sourcingActive ? "opacity-100" : "opacity-70")}>
          <Search size={15} />
        </span>
        <span className="flex-1">Sourcing</span>
        <Badge variant="live" size="sm">Live</Badge>
      </Link>

      {/* Sub-nav */}
      <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/[0.08] pl-3">
        {SOURCING_STAGES.map((stage) => (
          <div
            key={stage.label}
            className="flex items-center justify-between rounded-md px-2 py-1 text-xs text-white/40 hover:bg-white/[0.04] hover:text-white/60 cursor-pointer transition-colors"
          >
            <span>{stage.label}</span>
            <span className="font-mono text-2xs text-white/30">{stage.count}</span>
          </div>
        ))}

        {jobs.length > 0 && (
          <>
            <p className="mt-2 px-2 text-2xs font-semibold uppercase tracking-widest text-white/25">
              AI Sourced
            </p>
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/sourcing/${job.id}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors",
                  pathname === `/sourcing/${job.id}`
                    ? "bg-white/[0.10] font-medium text-white"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/75"
                )}
              >
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                <span className="truncate">{job.title}</span>
              </Link>
            ))}
          </>
        )}

        <Link
          href="/onboarding/search"
          className="mt-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.04] hover:text-teal-400"
        >
          <Plus size={12} />
          New Search
        </Link>
      </div>
    </div>
  );
}

function CreditMeter({
  usage,
}: {
  usage: Pick<CreditUsageSummary, "creditsRemaining" | "creditsLimit" | "plan">;
}) {
  const pct = Math.round(
    ((usage.creditsLimit - usage.creditsRemaining) / usage.creditsLimit) * 100
  );
  const fillColor = pct > 80 ? "#EF4444" : pct > 60 ? "#F59E0B" : "#1D9E75";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <div className="mb-1.5 flex justify-between">
        <span className="text-2xs text-white/40">
          Credits · {usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1)}
        </span>
        <span className="font-mono text-2xs text-white/60">
          {usage.creditsRemaining}/{usage.creditsLimit}
        </span>
      </div>
      <div className="h-[3px] w-full rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}

interface SidebarProps {
  user: User;
  creditUsage: Pick<CreditUsageSummary, "creditsRemaining" | "creditsLimit" | "plan">;
  jobs?: SourcingJob[];
}

export function Sidebar({ user, creditUsage, jobs = [] }: SidebarProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-sidebar shrink-0 flex-col bg-navy-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4 py-[18px]">
        <svg width="26" height="28" viewBox="0 0 120 130" fill="none" aria-hidden>
          <path
            d="M60 10C35 10 15 30 15 55C15 75 27 92 44 100L44 120L60 105L76 120L76 100C93 92 105 75 105 55C105 30 85 10 60 10Z"
            fill="white"
          />
          <path d="M60 10L105 55L76 100L76 120L60 105L60 10Z" fill="#5DCAA5" />
          <circle cx="60" cy="52" r="18" fill="#1D3557" />
        </svg>
        <span className="text-[15px] font-medium tracking-tight text-white">
          OpusRoster
        </span>
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3">
        <nav className="flex flex-col gap-0.5">
          {NAV_PRIMARY.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </nav>

        <SidebarSection label="Recruiting">
          <SourcingNav jobs={jobs} />
          <SidebarNavItem
            item={{ href: "/candidates", label: "Candidates", icon: <UserCheck size={15} /> }}
          />
          <SidebarNavItem
            item={{ href: "/outreach", label: "Outreach", icon: <Send size={15} /> }}
          />
          <SidebarNavItem
            item={{
              href: "/inbox",
              label: "Inbox",
              icon: <Mail size={15} />,
              badge: { label: "3", variant: "danger" },
            }}
          />
          <SidebarNavItem
            item={{ href: "/pipeline", label: "Pipeline", icon: <Columns size={15} /> }}
          />
        </SidebarSection>

        <SidebarSection label="Autopilot">
          {NAV_AUTOPILOT.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </SidebarSection>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.08] px-3 py-3 space-y-1">
        <div className="mb-2">
          <CreditMeter usage={creditUsage} />
        </div>
        <SidebarNavItem
          item={{ href: "/settings", label: "Settings", icon: <Settings size={15} /> }}
        />
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
          <Avatar
            initials={(user.fullName ?? user.email).slice(0, 2).toUpperCase()}
            size="xs"
            color="#5DCAA5"
            className="text-navy-800"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">
              {user.fullName ?? user.email}
            </p>
            <p className="truncate text-2xs text-white/40">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
