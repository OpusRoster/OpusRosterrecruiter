"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, fitScoreLabel } from "@/lib/utils";
import { MOCK_CANDIDATES } from "@/lib/mock/candidates";
import type { PipelineStage } from "@/types";

const STAGES: { value: PipelineStage | "all"; label: string }[] = [
  { value: "all",          label: "All candidates" },
  { value: "sourced",      label: "Sourced" },
  { value: "shortlisted",  label: "Shortlisted" },
  { value: "contacted",    label: "Contacted" },
  { value: "interviewing", label: "Interviewing" },
  { value: "hired",        label: "Hired" },
];

const STAGE_COLORS: Record<string, string> = {
  sourced:      "navy",
  shortlisted:  "teal",
  contacted:    "warning",
  interviewing: "purple",
  hired:        "success",
};

export default function CandidatesPage() {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "all">("all");

  const candidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((c) => {
      const matchesQuery = !query ||
        c.fullName.toLowerCase().includes(query.toLowerCase()) ||
        c.currentRole?.toLowerCase().includes(query.toLowerCase()) ||
        c.currentCompany?.toLowerCase().includes(query.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      return matchesQuery;
    }).sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));
  }, [query]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Talent pool"
        subtitle={`${candidates.length} candidates across all searches`}
      />

      {/* Filter bar */}
      <div className="shrink-0 border-b border-neutral-200 bg-white px-8 py-3 flex items-center gap-4">
        <div className="w-64">
          <Input
            placeholder="Search candidates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search size={13} />}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {STAGES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStageFilter(s.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                stageFilter === s.value
                  ? "border-navy-800 bg-navy-800 text-white"
                  : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate table */}
      <div className="flex-1 overflow-y-auto">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px_140px] gap-4 border-b border-neutral-200 bg-neutral-50 px-8 py-2.5">
          <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">Candidate</p>
          <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">Current role</p>
          <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">Location</p>
          <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">Skills</p>
          <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">Fit score</p>
          <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">Stage</p>
        </div>

        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-medium text-neutral-700 mb-1">No candidates found</p>
            <p className="text-xs text-neutral-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          candidates.map((candidate) => {
            const fitLevel = fitScoreLabel(candidate.fitScore ?? 0);
            const fitVariant = fitLevel === "excellent" ? "teal" : fitLevel === "good" ? "warning" : "danger";
            return (
              <div
                key={candidate.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px_140px] gap-4 items-center border-b border-neutral-100 px-8 py-3.5 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                {/* Candidate */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar initials={candidate.avatarInitials} color={candidate.avatarColor} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{candidate.fullName}</p>
                    <p className="text-xs text-neutral-400 truncate">{candidate.currentCompany}</p>
                  </div>
                </div>

                {/* Role */}
                <p className="text-sm text-neutral-600 truncate">{candidate.currentRole}</p>

                {/* Location */}
                <p className="text-xs text-neutral-500 truncate">{candidate.location}</p>

                {/* Skills */}
                <div className="flex gap-1 flex-wrap">
                  {candidate.skills.slice(0, 2).map((s) => (
                    <span key={s} className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-2xs text-neutral-500">{s}</span>
                  ))}
                  {candidate.skills.length > 2 && (
                    <span className="text-2xs text-neutral-400">+{candidate.skills.length - 2}</span>
                  )}
                </div>

                {/* Fit score */}
                <div>
                  {candidate.fitScore !== null && (
                    <Badge variant={fitVariant}>{candidate.fitScore} fit</Badge>
                  )}
                </div>

                {/* Stage */}
                <div>
                  <Badge variant={(STAGE_COLORS["sourced"] as any) ?? "default"}>Sourced</Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
