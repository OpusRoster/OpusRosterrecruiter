"use client";

import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp, Mail, Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, fitScoreLabel } from "@/lib/utils";
import type { CandidateProfile, PipelineStage } from "@/types";

// ─── Fit score pill ───────────────────────────────────────────────────────────

interface FitScorePillProps {
  score: number;
}

function FitScorePill({ score }: FitScorePillProps) {
  const level = fitScoreLabel(score);
  const styles = {
    excellent: "bg-teal-50 text-teal-700 border-teal-200",
    good:      "bg-amber-50 text-amber-700 border-amber-200",
    weak:      "bg-red-50 text-red-600 border-red-200",
  } as const;

  const labels = {
    excellent: "Excellent fit",
    good:      "Good fit",
    weak:      "Weak fit",
  } as const;

  return (
    <div className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1", styles[level])}>
      <span className="font-mono text-xs font-semibold">{score}</span>
      <span className="text-xs">{labels[level]}</span>
    </div>
  );
}

// ─── Skill tag ────────────────────────────────────────────────────────────────

function SkillTag({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-2xs text-neutral-600">
      {label}
    </span>
  );
}

// ─── Criteria summary ─────────────────────────────────────────────────────────

function CriteriaSummary({ met, total }: { met: number; total: number }) {
  const allMet = met === total;
  return (
    <span
      className={cn(
        "text-xs font-medium",
        allMet ? "text-teal-600" : met >= total * 0.7 ? "text-amber-600" : "text-neutral-400"
      )}
    >
      {met}/{total} criteria met
    </span>
  );
}

// ─── Reveal email button ──────────────────────────────────────────────────────

interface RevealEmailButtonProps {
  candidateId: string;
  onReveal: (id: string) => void;
  revealed: boolean;
  email: string | null;
}

function RevealEmailButton({ candidateId, onReveal, revealed, email }: RevealEmailButtonProps) {
  if (revealed && email) {
    return (
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
        onClick={(e) => e.stopPropagation()}
      >
        <Mail size={12} />
        {email}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onReveal(candidateId);
      }}
      className="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700"
    >
      <Lock size={11} />
      Show email
      <span className="text-neutral-300">·</span>
      <span className="text-neutral-400">1 credit</span>
    </button>
  );
}

// ─── Expanded criteria rows ───────────────────────────────────────────────────

interface CriteriaRowProps {
  criterion: string;
  met: boolean;
  evidence: string;
}

function CriteriaRow({ criterion, met, evidence }: CriteriaRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
        met
          ? "border-teal-200 bg-teal-50/60"
          : "border-amber-200 bg-amber-50/40"
      )}
    >
      <span
        className={cn(
          "mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-2xs font-bold",
          met ? "bg-teal-500 text-white" : "bg-amber-400 text-white"
        )}
      >
        {met ? "✓" : "!"}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-800">{criterion}</p>
        <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">{evidence}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface CandidateCardProps {
  candidate: CandidateProfile;
  stage: PipelineStage;
  onShortlist: (id: string) => void;
  onDecline: (id: string) => void;
  onRevealEmail: (id: string) => void;
  onOpenDetail: (id: string) => void;
  isShortlisted?: boolean;
  className?: string;
}

export function CandidateCard({
  candidate,
  stage,
  onShortlist,
  onDecline,
  onRevealEmail,
  onOpenDetail,
  isShortlisted,
  className,
}: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false);

  const metCount = candidate.fitCriteria.filter((c) => c.met).length;
  const totalCount = candidate.fitCriteria.length;

  return (
    <article
      className={cn(
        "rounded-xl border bg-white transition-shadow",
        isShortlisted
          ? "border-teal-300 shadow-[0_0_0_3px_theme(colors.teal.50)]"
          : "border-neutral-200 hover:shadow-sm",
        className
      )}
    >
      {/* ── Main row ── */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <Avatar
            initials={candidate.avatarInitials}
            color={candidate.avatarColor}
            size="md"
          />

          <div className="flex-1 min-w-0">
            {/* Name + shortlisted badge */}
            <div className="flex items-center gap-2 mb-0.5">
              <button
                type="button"
                onClick={() => onOpenDetail(candidate.id)}
                className="text-sm font-semibold text-neutral-900 hover:text-teal-700 transition-colors text-left"
              >
                {candidate.fullName}
              </button>
              {isShortlisted && (
                <Badge variant="teal" size="sm">Shortlisted</Badge>
              )}
            </div>

            {/* Role · Company */}
            <p className="text-xs text-neutral-500 mb-1">
              {candidate.currentRole}
              {candidate.currentCompany && (
                <>
                  {" · "}
                  <span className="font-medium text-neutral-700">
                    {candidate.currentCompany}
                  </span>
                </>
              )}
            </p>

            {/* Location · Experience */}
            <div className="flex items-center gap-3 mb-3">
              {candidate.location && (
                <span className="flex items-center gap-1 text-2xs text-neutral-400">
                  <MapPin size={11} />
                  {candidate.location}
                </span>
              )}
              {candidate.yearsExperience !== null && (
                <span className="text-2xs text-neutral-400">
                  {candidate.yearsExperience} yrs exp
                </span>
              )}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {candidate.skills.slice(0, 6).map((s) => (
                <SkillTag key={s} label={s} />
              ))}
              {candidate.skills.length > 6 && (
                <span className="text-2xs text-neutral-400 self-center">
                  +{candidate.skills.length - 6}
                </span>
              )}
            </div>

            {/* Bottom action row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {candidate.fitScore !== null && (
                  <FitScorePill score={candidate.fitScore} />
                )}
                {totalCount > 0 && (
                  <CriteriaSummary met={metCount} total={totalCount} />
                )}
                <RevealEmailButton
                  candidateId={candidate.id}
                  onReveal={onRevealEmail}
                  revealed={candidate.emailRevealed}
                  email={candidate.email}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-50"
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded ? "Less" : "Details"}
                </button>

                {!isShortlisted && stage === "sourced" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onShortlist(candidate.id)}
                  >
                    Shortlist
                  </Button>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDecline(candidate.id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Expanded: criteria + AI insight ── */}
      {expanded && (
        <div className="border-t border-neutral-100 bg-neutral-50/60 px-5 py-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Criteria */}
            <div>
              <p className="mb-3 text-2xs font-semibold uppercase tracking-widest text-neutral-400">
                Fit criteria
              </p>
              <div className="flex flex-col gap-2">
                {candidate.fitCriteria.map((c, i) => (
                  <CriteriaRow
                    key={i}
                    criterion={c.criterion}
                    met={c.met}
                    evidence={c.evidence}
                  />
                ))}
              </div>
            </div>

            {/* AI insight */}
            <div>
              <p className="mb-3 text-2xs font-semibold uppercase tracking-widest text-neutral-400">
                AI insight
              </p>
              {candidate.aiSummary ? (
                <div className="rounded-xl border border-navy-100 bg-navy-50 px-4 py-3.5">
                  <p className="text-sm leading-relaxed text-navy-700">
                    {candidate.aiSummary}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-400">No AI summary available.</p>
              )}

              {/* Recent work */}
              {candidate.workHistory.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-2xs font-semibold uppercase tracking-widest text-neutral-400">
                    Recent experience
                  </p>
                  <div className="flex flex-col gap-3">
                    {candidate.workHistory.slice(0, 2).map((w, i) => (
                      <div key={i}>
                        <p className="text-xs font-medium text-neutral-800">{w.title}</p>
                        <p className="text-xs text-neutral-500">
                          {w.company}
                          {" · "}
                          {w.startDate.replace("-", " ")}–
                          {w.endDate ? w.endDate.replace("-", " ") : "Present"}
                        </p>
                        {w.summary && (
                          <p className="mt-0.5 text-xs text-neutral-400 leading-relaxed">
                            {w.summary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
