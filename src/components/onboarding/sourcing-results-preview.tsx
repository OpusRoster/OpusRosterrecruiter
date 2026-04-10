import { CheckCircle2, XCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, fitScoreLabel } from "@/lib/utils";
import type { CandidateProfile } from "@/types";

interface SourcingResultsPreviewProps {
  candidates: CandidateProfile[];
  matchCount: number;
}

function FitScoreBadge({ score }: { score: number }) {
  const level = fitScoreLabel(score);
  return (
    <Badge
      variant={level === "excellent" ? "teal" : level === "good" ? "warning" : "danger"}
      size="default"
    >
      {score} fit
    </Badge>
  );
}

function CandidatePreviewRow({ candidate }: { candidate: CandidateProfile }) {
  const metCount = candidate.fitCriteria.filter((c) => c.met).length;
  const totalCount = candidate.fitCriteria.length;

  return (
    <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-4 last:border-b-0">
      <Avatar
        initials={candidate.avatarInitials}
        color={candidate.avatarColor}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{candidate.fullName}</p>
        </div>
        <p className="text-xs text-neutral-500">
          {candidate.currentRole} · {candidate.currentCompany}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">{candidate.location}</p>
      </div>

      {/* Criteria summary */}
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        <CheckCircle2 size={13} className="text-teal-500" />
        <span className="text-xs text-neutral-500">
          {metCount}/{totalCount} criteria
        </span>
      </div>

      {/* Skills */}
      <div className="hidden shrink-0 gap-1 lg:flex">
        {candidate.skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-2xs text-neutral-500"
          >
            {s}
          </span>
        ))}
      </div>

      {candidate.fitScore !== null && (
        <div className="shrink-0">
          <FitScoreBadge score={candidate.fitScore} />
        </div>
      )}
    </div>
  );
}

export function SourcingResultsPreview({
  candidates,
  matchCount,
}: SourcingResultsPreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
        <CheckCircle2 size={16} className="shrink-0 text-teal-500" />
        <p className="text-sm text-teal-800">
          <span className="font-semibold">
            {matchCount.toLocaleString()} candidates matched
          </span>{" "}
          your role, location, and skill priorities. Showing the top{" "}
          {candidates.length} by fit score.
        </p>
      </div>

      {/* Candidate list */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {candidates.map((c) => (
          <CandidatePreviewRow key={c.id} candidate={c} />
        ))}
      </div>

      <p className="text-center text-xs text-neutral-400">
        Open the sourcing dashboard to shortlist, decline, or reveal contact
        details.
      </p>
    </div>
  );
}
