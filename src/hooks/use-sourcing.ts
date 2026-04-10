"use client";

import { useCallback, useMemo, useState } from "react";
import type { CandidateProfile, PipelineStage, SourcingResult } from "@/types";

export type SourcingTab = "sourced" | "shortlisted" | "outreach" | "declined";
export type SortOption = "fit" | "recent" | "name";

interface UseSourcingOptions {
  initialResults: SourcingResult[];
}

interface UseSourcingReturn {
  results: SourcingResult[];
  filteredResults: SourcingResult[];
  activeTab: SourcingTab;
  setActiveTab: (tab: SourcingTab) => void;
  query: string;
  setQuery: (q: string) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  tabCounts: Record<SourcingTab, number>;
  selectedCandidateId: string | null;
  selectedCandidate: CandidateProfile | null;
  selectedStage: PipelineStage;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  shortlist: (id: string) => void;
  decline: (id: string) => void;
  revealEmail: (id: string) => void;
  moveStage: (id: string, stage: PipelineStage) => void;
  saveNote: (id: string, note: string) => void;
}

export function useSourcing({ initialResults }: UseSourcingOptions): UseSourcingReturn {
  const [results, setResults] = useState<SourcingResult[]>(initialResults);
  const [activeTab, setActiveTab] = useState<SourcingTab>("sourced");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("fit");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // ── Derived tab counts ──────────────────────────────────────────────────────
  const tabCounts = useMemo<Record<SourcingTab, number>>(() => ({
    sourced:     results.filter((r) => r.stage === "sourced").length,
    shortlisted: results.filter((r) => r.stage === "shortlisted").length,
    outreach:    results.filter((r) => r.stage === "contacted").length,
    declined:    results.filter((r) => r.stage === "declined").length,
  }), [results]);

  // ── Filtered + sorted results for current tab ───────────────────────────────
  const filteredResults = useMemo<SourcingResult[]>(() => {
    const stageMap: Record<SourcingTab, PipelineStage[]> = {
      sourced:     ["sourced"],
      shortlisted: ["shortlisted"],
      outreach:    ["contacted"],
      declined:    ["declined"],
    };

    let list = results.filter((r) => stageMap[activeTab].includes(r.stage));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => {
        const c = r.candidate;
        return (
          c.fullName.toLowerCase().includes(q) ||
          c.currentRole?.toLowerCase().includes(q) ||
          c.currentCompany?.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
        );
      });
    }

    return [...list].sort((a, b) => {
      if (sortBy === "fit") return (b.fitScore ?? 0) - (a.fitScore ?? 0);
      if (sortBy === "name") return a.candidate.fullName.localeCompare(b.candidate.fullName);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [results, activeTab, query, sortBy]);

  // ── Selected candidate ──────────────────────────────────────────────────────
  const selectedResult = results.find((r) => r.candidate.id === selectedCandidateId);
  const selectedCandidate = selectedResult?.candidate ?? null;
  const selectedStage: PipelineStage = selectedResult?.stage ?? "sourced";

  // ── Actions ─────────────────────────────────────────────────────────────────
  const updateStage = useCallback((candidateId: string, stage: PipelineStage) => {
    setResults((prev) =>
      prev.map((r) =>
        r.candidate.id === candidateId
          ? { ...r, stage, actionedAt: new Date().toISOString() }
          : r
      )
    );
  }, []);

  const shortlist = useCallback((id: string) => updateStage(id, "shortlisted"), [updateStage]);
  const decline   = useCallback((id: string) => updateStage(id, "declined"),    [updateStage]);
  const moveStage = useCallback((id: string, stage: PipelineStage) => {
    updateStage(id, stage);
  }, [updateStage]);

  const revealEmail = useCallback((candidateId: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.candidate.id === candidateId
          ? {
              ...r,
              candidate: {
                ...r.candidate,
                emailRevealed: true,
                email: r.candidate.email ?? `${candidateId.slice(0, 6)}@example.com`,
              },
            }
          : r
      )
    );
    // TODO: POST /api/sourcing/reveal-email — deduct 1 credit from org
  }, []);

  const saveNote = useCallback((candidateId: string, note: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.candidate.id === candidateId ? { ...r, recruiterNote: note } : r
      )
    );
    // TODO: PATCH /api/sourcing-results/:id — persist note
  }, []);

  const openDetail  = useCallback((id: string) => setSelectedCandidateId(id), []);
  const closeDetail = useCallback(() => setSelectedCandidateId(null), []);

  return {
    results,
    filteredResults,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    sortBy,
    setSortBy,
    tabCounts,
    selectedCandidateId,
    selectedCandidate,
    selectedStage,
    openDetail,
    closeDetail,
    shortlist,
    decline,
    revealEmail,
    moveStage,
    saveNote,
  };
}
