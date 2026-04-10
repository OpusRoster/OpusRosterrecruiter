"use client";

import { PipelineLane } from "./pipeline-lane";
import { CandidateDetailDrawer } from "./candidate-detail-drawer";
import { PIPELINE_LANES, usePipeline } from "@/hooks/use-pipeline";
import type { SourcingResult } from "@/types";

interface PipelineBoardProps {
  initialResults: SourcingResult[];
}

export function PipelineBoard({ initialResults }: PipelineBoardProps) {
  const {
    laneResults,
    dragState,
    startDrag,
    dropOnLane,
    cancelDrag,
    moveCandidate,
    selectedCandidate,
    openDetail,
    closeDetail,
  } = usePipeline({ initialResults });

  return (
    <div
      className="flex h-full gap-3 overflow-x-auto p-6"
      onDragEnd={cancelDrag}
    >
      {PIPELINE_LANES.map((lane) => (
        <PipelineLane
          key={lane.stage}
          config={lane}
          results={laneResults.get(lane.stage) ?? []}
          draggingCandidateId={dragState?.candidateId ?? null}
          isDragTarget={dragState !== null}
          onDragStart={startDrag}
          onDrop={dropOnLane}
          onOpenDetail={openDetail}
        />
      ))}

      {/* Detail drawer */}
      {selectedCandidate && (
        <CandidateDetailDrawer
          candidate={selectedCandidate.candidate}
          stage={selectedCandidate.stage}
          onClose={closeDetail}
          onRevealEmail={() => {}}
          onStageChange={(id, stage) => moveCandidate(id, stage)}
          onSaveNote={() => {}}
        />
      )}
    </div>
  );
}
