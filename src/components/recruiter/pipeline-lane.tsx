"use client";

import { useState } from "react";
import { PipelineCandidateTile } from "./pipeline-candidate-tile";
import { cn } from "@/lib/utils";
import type { PipelineStage, SourcingResult } from "@/types";
import type { PipelineLaneConfig } from "@/hooks/use-pipeline";

interface PipelineLaneProps {
  config: PipelineLaneConfig;
  results: SourcingResult[];
  isDragTarget?: boolean;
  draggingCandidateId?: string | null;
  onDragStart: (candidateId: string, fromStage: PipelineStage) => void;
  onDrop: (toStage: PipelineStage) => void;
  onOpenDetail: (id: string) => void;
}

export function PipelineLane({
  config,
  results,
  isDragTarget,
  draggingCandidateId,
  onDragStart,
  onDrop,
  onOpenDetail,
}: PipelineLaneProps) {
  const [dragOver, setDragOver] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    onDrop(config.stage);
  }

  return (
    <div className="flex w-[210px] shrink-0 flex-col">
      {/* Lane header */}
      <div
        className="mb-2 flex items-center justify-between rounded-lg px-3 py-2"
        style={{ backgroundColor: config.bgColor, border: `1px solid ${config.borderColor}` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: config.accentColor }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: config.accentColor }}
          >
            {config.label}
          </span>
        </div>
        <span
          className="rounded-full px-1.5 py-0.5 text-2xs font-bold"
          style={{
            backgroundColor: config.borderColor,
            color: config.accentColor,
          }}
        >
          {results.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "flex flex-1 flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition-colors",
          dragOver
            ? "border-teal-400 bg-teal-50/60"
            : "border-transparent"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          minHeight: 120,
          backgroundColor: dragOver ? undefined : `${config.bgColor}60`,
        }}
      >
        {results.length === 0 && !dragOver && (
          <div className="flex flex-1 items-center justify-center py-6">
            <p className="text-center text-2xs text-neutral-400">
              Drop candidates here
            </p>
          </div>
        )}

        {results.map((result) => (
          <PipelineCandidateTile
            key={result.candidate.id}
            result={result}
            isDragging={result.candidate.id === draggingCandidateId}
            onDragStart={onDragStart}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </div>
  );
}
