"use client";
import { useMemo } from "react";
import { notFound } from "next/navigation";
import { CandidateCard } from "@/components/recruiter/candidate-card";
import { CandidateDetailDrawer } from "@/components/recruiter/candidate-detail-drawer";
import { JobSummaryHeader } from "@/components/recruiter/job-summary-header";
import { SourcingFilterBar } from "@/components/sourcing/sourcing-filter-bar";
import { SourcingAiBanner } from "@/components/sourcing/sourcing-ai-banner";
import { useSourcing } from "@/hooks/use-sourcing";
import { MOCK_JOBS, getMockSourcingResults } from "@/lib/mock/candidates";

interface Props { params: { jobId: string } }

export default function SourcingJobPage({ params }: Props) {
  const job = MOCK_JOBS.find((j) => j.id === params.jobId);
  if (!job) notFound();

  const initialResults = useMemo(() => getMockSourcingResults(job.id), [job.id]);
  const { filteredResults, activeTab, setActiveTab, query, setQuery, sortBy, setSortBy, tabCounts, selectedCandidate, selectedStage, openDetail, closeDetail, shortlist, decline, revealEmail, moveStage, saveNote } = useSourcing({ initialResults });

  const TABS = [
    { id: "sourced", label: "AI sourced", count: tabCounts.sourced },
    { id: "shortlisted", label: "Shortlisted", count: tabCounts.shortlisted },
    { id: "outreach", label: "In outreach", count: tabCounts.outreach },
    { id: "declined", label: "Declined", count: tabCounts.declined },
  ];

  const activeFilters = [
    job.skills.length > 0 ? { id: "skills", label: job.skills.slice(0, 3).join(" · "), onRemove: () => {} } : null,
    job.location ? { id: "location", label: job.location, onRemove: () => {} } : null,
  ].filter(Boolean) as { id: string; label: string; onRemove: () => void }[];

  const avgFitScore = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((s, r) => s + (r.fitScore ?? 0), 0) / filteredResults.length)
    : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <JobSummaryHeader job={job} tabs={TABS} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as typeof activeTab)} avgFitScore={avgFitScore} emailsFound={847} shortlistCount={tabCounts.shortlisted} />
      <SourcingFilterBar query={query} onQueryChange={setQuery} activeFilters={activeFilters} sortBy={sortBy} onSortChange={setSortBy} />
      {activeTab === "sourced" && <SourcingAiBanner matchCount={job.matchCount} visibleCount={filteredResults.length} />}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 py-20 max-w-4xl text-center">
            <p className="text-sm font-medium text-neutral-700">No candidates found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-4xl">
            {filteredResults.map((result) => (
              <CandidateCard key={result.candidate.id} candidate={result.candidate} stage={result.stage} isShortlisted={result.stage === "shortlisted"} onShortlist={shortlist} onDecline={decline} onRevealEmail={revealEmail} onOpenDetail={openDetail} />
            ))}
          </div>
        )}
      </div>
      <CandidateDetailDrawer candidate={selectedCandidate} stage={selectedStage} onClose={closeDetail} onRevealEmail={revealEmail} onStageChange={moveStage} onSaveNote={saveNote} />
    </div>
  );
}
