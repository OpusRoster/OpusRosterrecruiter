"use client";

import { useCallback, useMemo, useState } from "react";
import type { PipelineStage, SourcingResult } from "@/types";

export interface PipelineLaneConfig {
  stage: PipelineStage;
  label: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

export const PIPELINE_LANES: PipelineLaneConfig[] = [
  { stage: "sourced",      label: "Sourced",      accentColor: "#1D3557", bgColor: "#EFF5FB", borderColor: "#B8D0E8" },
  { stage: "shortlisted",  label: "Shortlisted",  accentColor: "#1D9E75", bgColor: "#E1F5EE", borderColor: "#9FE1CB" },
  { stage: "contacted",    label: "Contacted",    accentColor: "#D97706", bgColor: "#FEF3C7", borderColor: "#FCD34D" },
  { stage: "interviewing", label: "Interviewing", accentColor: "#4F46E5", bgColor: "#EEF2FF", borderColor: "#C7D2FE" },
  { stage: "hired",        label: "Hired",        accentColor: "#059669", bgColor: "#ECFDF5", borderColor: "#6EE7B7" },
];

interface DragState {
  candidateId: string;
  fromStage: PipelineStage;
}

interface UsePipelineOptions {
  initialResults: SourcingResult[];
}

interface UsePipelineReturn {
  laneResults: Map<PipelineStage, SourcingResult[]>;
  dragState: DragState | null;
  startDrag: (candidateId: string, fromStage: PipelineStage) => void;
  dropOnLane: (toStage: PipelineStage) => void;
  cancelDrag: () => void;
  moveCandidate: (candidateId: string, toStage: PipelineStage) => void;
  selectedCandidate: SourcingResult | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  filterJobId: string | null;
  setFilterJobId: (id: string | null) => void;
}

export function usePipeline({ initialResults }: UsePipelineOptions): UsePipelineReturn {
  const [results, setResults] = useState<SourcingResult[]>(initialResults);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterJobId, setFilterJobId] = useState<string | null>(null);

  const visibleResults = useMemo(
    () => (filterJobId ? results.filter((r) => r.jobId === filterJobId) : results),
    [results, filterJobId]
  );

  const laneResults = useMemo<Map<PipelineStage, SourcingResult[]>>(() => {
    const map = new Map<PipelineStage, SourcingResult[]>();
    PIPELINE_LANES.forEach(({ stage }) => map.set(stage, []));
    visibleResults.forEach((r) => {
      const lane = map.get(r.stage);
      if (lane) lane.push(r);
    });
    return map;
  }, [visibleResults]);

  const moveCandidate = useCallback((candidateId: string, toStage: PipelineStage) => {
    setResults((prev) =>
      prev.map((r) =>
        r.candidate.id === candidateId
          ? { ...r, stage: toStage, actionedAt: new Date().toISOString() }
          : r
      )
    );
    // TODO: PATCH /api/sourcing-results/:id — persist stage change
  }, []);

  const startDrag = useCallback((candidateId: string, fromStage: PipelineStage) => {
    setDragState({ candidateId, fromStage });
  }, []);

  const dropOnLane = useCallback((toStage: PipelineStage) => {
    if (!dragState) return;
    if (dragState.fromStage !== toStage) {
      moveCandidate(dragState.candidateId, toStage);
    }
    setDragState(null);
  }, [dragState, moveCandidate]);

  const cancelDrag = useCallback(() => setDragState(null), []);

  const selectedCandidate = results.find((r) => r.candidate.id === selectedId) ?? null;
  const openDetail  = useCallback((id: string) => setSelectedId(id), []);
  const closeDetail = useCallback(() => setSelectedId(null), []);

  return {
    laneResults,
    dragState,
    startDrag,
    dropOnLane,
    cancelDrag,
    moveCandidate,
    selectedCandidate,
    openDetail,
    closeDetail,
    filterJobId,
    setFilterJobId,
  };
}
