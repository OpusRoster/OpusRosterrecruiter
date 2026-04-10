"use client";

import { GripVertical } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn, fitScoreLabel } from "@/lib/utils";
import type { PipelineStage, SourcingResult } from "@/types";

function FitDot({ score }: { score: number }) {
  const level = fitScoreLabel(score);
  const color = level === "excellent" ? "bg-teal-500" : level === "good" ? "bg-amber-400" : "bg-red-400";
  return <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", color)} />;
}

interface PipelineCandidateTileProps {
  result: SourcingResult;
  isDragging?: boolean;
  onDragStart: (candidateId: string, fromStage: PipelineStage) => void;
  onOpenDetail: (id: string) => void;
}

export function PipelineCandidateTile({
  result,
  isDragging,
  onDragStart,
  onOpenDetail,
}: PipelineCandidateTileProps) {
  const { candidate } = result;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(candidate.id, result.stage)}
      className={cn(
        "group cursor-grab rounded-lg border border-neutral-200 bg-white px-3 py-3 transition-shadow select-none",
        isDragging ? "opacity-40 shadow-md" : "hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle — visible on hover */}
        <div className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-40">
          <GripVertical size={12} className="text-neutral-400" />
        </div>

        <Avatar
          initials={candidate.avatarInitials}
          color={candidate.avatarColor}
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onOpenDetail(candidate.id)}
            className="w-full text-left"
          >
            <p className="truncate text-xs font-medium text-neutral-900 hover:text-teal-700 transition-colors">
              {candidate.fullName}
            </p>
          </button>
          <p className="mt-0.5 truncate text-2xs text-neutral-500">
            {candidate.currentRole}
            {candidate.currentCompany && ` · ${candidate.currentCompany}`}
          </p>

          {/* Fit score row */}
          {candidate.fitScore !== null && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <FitDot score={candidate.fitScore} />
              <span className="font-mono text-2xs font-medium text-neutral-600">
                {candidate.fitScore}
              </span>
              <span className="text-2xs text-neutral-400">fit score</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
