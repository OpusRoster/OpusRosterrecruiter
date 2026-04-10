"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Zap, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CreditUsageCard } from "@/components/dashboard/credit-usage-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { MOCK_ACTIVITY } from "@/lib/mock/activity";
import { MapPin } from "lucide-react";

const CREDIT_USAGE = {
  creditsRemaining: 373, creditsLimit: 500, creditsUsedThisMonth: 127,
  videoScreensUsed: 0, videoScreensLimit: 5, plan: "starter" as const,
  renewalDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
};

interface Job {
  id: string;
  title: string;
  location: string | null;
  status: string;
  match_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (user.email) {
        setUserName(user.email.split("@")[0] ?? "there");
      }

      const { data: profile } = await supabase
        .from("users")
        .select("org_id, full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) setUserName(profile.full_name);
      if (!profile?.org_id) return;

      const { data: jobData } = await supabase
        .from("jobs")
        .select("id, title, location, status, match_count, created_at")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false });

      if (jobData) setJobs(jobData);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        title={`Good morning, ${userName}`}
        subtitle={`${jobs.length} active searches`}
        actions={
          <Link href="/onboarding/search">
            <Button variant="primary">+ New search</Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8 grid grid-cols-4 gap-4">
          <StatCard label="Jobs created" value={jobs.length} delta="Your active searches" icon={<Users size={14}/>} />
          <StatCard label="Avg fit score" value={83} delta="Across all searches" icon={<TrendingUp size={14}/>} />
          <StatCard label="Shortlisted" value={0} delta="Start shortlisting candidates" icon={<Zap size={14}/>} />
          <StatCard label="Credits remaining" value={CREDIT_USAGE.creditsRemaining} delta="Resets May 1" deltaPositive={false} icon={<LayoutDashboard size={14}/>} />
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          <div className="flex flex-col gap-6">
            {/* Active searches */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active searches</CardTitle>
                  <Link href="/sourcing" className="text-xs font-medium text-teal-600 hover:text-teal-700">
                    View all →
                  </Link>
                </div>
              </CardHeader>
              <div>
                {jobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-neutral-500 mb-3">No searches yet</p>
                    <Link href="/onboarding/search">
                      <Button variant="primary" size="sm">+ Create your first search</Button>
                    </Link>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <Link key={job.id} href={`/sourcing/${job.id}`} className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3.5 last:border-b-0 hover:bg-neutral-50 transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700 text-sm font-medium">
                        {job.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900 hover:text-teal-700">{job.title}</p>
                        {job.location && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-neutral-400" />
                            <p className="text-xs text-neutral-400">{job.location}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-900">{job.match_count.toLocaleString()}</p>
                          <p className="text-2xs text-neutral-400">matches</p>
                        </div>
                        <Badge variant={job.status === "active" ? "teal" : "warning"}>{job.status}</Badge>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>

            {/* Pipeline summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pipeline</CardTitle>
                  <Link href="/pipeline" className="text-xs font-medium text-teal-600 hover:text-teal-700">
                    Open Kanban →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 divide-x divide-neutral-100">
                  {([
                    { label: "Sourced", value: 0, color: "text-navy-800" },
                    { label: "Shortlisted", value: 0, color: "text-teal-600" },
                    { label: "Contacted", value: 0, color: "text-neutral-400" },
                    { label: "Interviewing", value: 0, color: "text-neutral-400" },
                    { label: "Hired", value: 0, color: "text-neutral-400" },
                  ] as const).map((s) => (
                    <div key={s.label} className="flex flex-col items-center py-2">
                      <p className={`text-2xl font-medium tracking-tight ${s.color}`}>{s.value}</p>
                      <p className="mt-0.5 text-2xs text-neutral-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
              <ActivityFeed events={MOCK_ACTIVITY} />
            </Card>
            <CreditUsageCard usage={CREDIT_USAGE} />
          </div>
        </div>
      </div>
    </div>
  );
}
