import Link from "next/link";
import { MapPin, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";

interface SourcingTab {
  id: string;
  label: string;
  count: number;
}

interface JobSummaryHeaderProps {
  job: Job;
  tabs: SourcingTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  avgFitScore?: number;
  emailsFound?: number;
  shortlistCount?: number;
}

function KpiPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3.5 py-2.5 text-center">
      <p className="text-base font-semibold tracking-tight text-neutral-900">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-0.5 text-2xs text-neutral-400">{label}</p>
    </div>
  );
}

export function JobSummaryHeader({
  job,
  tabs,
  activeTab,
  onTabChange,
  avgFitScore,
  emailsFound,
  shortlistCount = 0,
}: JobSummaryHeaderProps) {
  return (
    <div className="shrink-0 border-b border-neutral-200 bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-8 pt-4 text-xs text-neutral-400">
        <Link href="/sourcing" className="transition-colors hover:text-neutral-600">
          Sourcing
        </Link>
        <span>/</span>
        <span className="text-neutral-600">{job.title}</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-6 px-8 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              {job.title}
            </h1>
            <Badge variant={job.status === "active" ? "teal" : "warning"}>
              {job.status}
            </Badge>
            {job.sourcingStatus === "running" && (
              <div className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-2xs font-medium text-teal-700">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                AI sourcing active
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {job.location && (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <MapPin size={12} />
                {job.location}
              </span>
            )}
            {job.remote && (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Wifi size={12} />
                Remote OK
              </span>
            )}
            {job.skills.length > 0 && (
              <span className="text-xs text-neutral-400">
                {job.skills.slice(0, 3).join(" · ")}
                {job.skills.length > 3 && ` +${job.skills.length - 3}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="md">Edit search</Button>
          <Button variant="secondary" size="md">Launch outreach</Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="flex items-center gap-2.5 px-8 pb-4">
        <KpiPill label="Matched" value={job.matchCount} />
        {avgFitScore !== undefined && (
          <KpiPill label="Avg fit score" value={avgFitScore} />
        )}
        <KpiPill label="Shortlisted" value={shortlistCount} />
        {emailsFound !== undefined && (
          <KpiPill label="Emails found" value={emailsFound} />
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-end gap-0 px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 pb-3 pt-1 text-sm transition-colors",
              activeTab === tab.id
                ? "border-navy-800 font-medium text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-2xs font-semibold",
                activeTab === tab.id
                  ? "bg-navy-800 text-white"
                  : "bg-neutral-100 text-neutral-500"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
