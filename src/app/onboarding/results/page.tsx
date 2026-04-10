"use client";
import Link from "next/link";
import { SourcingResultsPreview } from "@/components/onboarding/sourcing-results-preview";
import { Button } from "@/components/ui/button";
import { MOCK_CANDIDATES, MOCK_JOBS } from "@/lib/mock/candidates";

export default function OnboardingResultsPage() {
  const job = MOCK_JOBS[0]!;
  const topCandidates = MOCK_CANDIDATES.slice(0, 4);
  return (
    <>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
        ✦ AI sourcing complete
      </div>
      <h2 className="font-display text-3xl text-neutral-900 mb-2">Your first candidates are ready</h2>
      <p className="text-sm text-neutral-500 mb-8">We found candidates aligned to your role, location, and skill priorities.</p>
      <SourcingResultsPreview candidates={topCandidates} matchCount={job.matchCount} />
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-neutral-200 pt-8">
        <Link href="/dashboard">
          <Button variant="primary" size="lg">Go to dashboard →</Button>
        </Link>
      </div>
    </>
  );
}
