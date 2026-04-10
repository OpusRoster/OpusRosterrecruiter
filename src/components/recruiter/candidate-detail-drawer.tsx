"use client";

import { useEffect, useRef, useState } from "react";
import { X, MapPin, Mail, Lock, Linkedin, CheckCircle2, AlertCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn, fitScoreLabel } from "@/lib/utils";
import type { CandidateProfile, PipelineStage } from "@/types";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-5">
      <h3 className="mb-3 text-2xs font-semibold uppercase tracking-widest text-neutral-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

// ─── Work history item ────────────────────────────────────────────────────────

interface WorkItemProps {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  location: string;
  summary: string | null;
  isLast?: boolean;
}

function WorkItem({ title, company, startDate, endDate, location, summary, isLast }: WorkItemProps) {
  return (
    <div className="relative flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-navy-700" />
        {!isLast && <div className="mt-1 w-px flex-1 bg-neutral-200" />}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-5")}>
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-xs font-medium text-neutral-600">{company}</span>
          <span className="text-2xs text-neutral-300">·</span>
          <span className="text-xs text-neutral-400">
            {startDate.replace("-", " ")} –{" "}
            {endDate ? endDate.replace("-", " ") : "Present"}
          </span>
          <span className="text-2xs text-neutral-300">·</span>
          <span className="text-xs text-neutral-400">{location}</span>
        </div>
        {summary && (
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{summary}</p>
        )}
      </div>
    </div>
  );
}

// ─── Criteria list ────────────────────────────────────────────────────────────

interface CriteriaItemProps {
  criterion: string;
  met: boolean;
  evidence: string;
}

function CriteriaItem({ criterion, met, evidence }: CriteriaItemProps) {
  return (
    <div className="flex items-start gap-2.5">
      {met ? (
        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-teal-500" />
      ) : (
        <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-800">{criterion}</p>
        <p className="text-xs text-neutral-500 leading-relaxed">{evidence}</p>
      </div>
    </div>
  );
}

// ─── Stage move menu ──────────────────────────────────────────────────────────

const STAGE_OPTIONS: { value: PipelineStage; label: string }[] = [
  { value: "shortlisted",  label: "Shortlist" },
  { value: "contacted",    label: "Move to Contacted" },
  { value: "interviewing", label: "Move to Interviewing" },
  { value: "offered",      label: "Move to Offered" },
  { value: "hired",        label: "Mark as Hired" },
  { value: "declined",     label: "Decline" },
];

interface StageMoveMenuProps {
  currentStage: PipelineStage;
  onMove: (stage: PipelineStage) => void;
}

function StageMoveMenu({ currentStage, onMove }: StageMoveMenuProps) {
  const options = STAGE_OPTIONS.filter((s) => s.value !== currentStage);
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onMove(opt.value)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            opt.value === "declined"
              ? "border-red-200 text-red-600 hover:bg-red-50"
              : opt.value === "hired"
              ? "border-teal-300 text-teal-700 hover:bg-teal-50"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

export interface CandidateDetailDrawerProps {
  candidate: CandidateProfile | null;
  stage: PipelineStage;
  onClose: () => void;
  onRevealEmail: (id: string) => void;
  onStageChange: (id: string, stage: PipelineStage) => void;
  onSaveNote: (id: string, note: string) => void;
}

export function CandidateDetailDrawer({
  candidate,
  stage,
  onClose,
  onRevealEmail,
  onStageChange,
  onSaveNote,
}: CandidateDetailDrawerProps) {
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset note when candidate changes
  useEffect(() => {
    setNote("");
    setNoteSaved(false);
  }, [candidate?.id]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSaveNote() {
    if (!candidate || !note.trim()) return;
    onSaveNote(candidate.id, note.trim());
    setNoteSaved(true);
  }

  if (!candidate) return null;

  const metCount = candidate.fitCriteria.filter((c) => c.met).length;
  const totalCount = candidate.fitCriteria.length;
  const fitLevel = candidate.fitScore !== null ? fitScoreLabel(candidate.fitScore) : null;

  const fitBadgeVariant = fitLevel === "excellent" ? "teal" : fitLevel === "good" ? "warning" : "danger";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-label={`Candidate profile: ${candidate.fullName}`}
        className="fixed inset-y-0 right-0 z-50 flex w-[560px] max-w-full flex-col bg-white shadow-drawer"
      >
        {/* ── Header ── */}
        <div className="shrink-0 border-b border-neutral-200 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Avatar
                initials={candidate.avatarInitials}
                color={candidate.avatarColor}
                size="lg"
              />
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                  {candidate.fullName}
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">
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
                <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                  {candidate.location && (
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <MapPin size={11} />
                      {candidate.location}
                    </span>
                  )}
                  {candidate.yearsExperience !== null && (
                    <span className="text-xs text-neutral-400">
                      {candidate.yearsExperience} yrs exp
                    </span>
                  )}
                  {candidate.fitScore !== null && (
                    <Badge variant={fitBadgeVariant}>
                      {candidate.fitScore} fit · {metCount}/{totalCount} criteria
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-100"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="shrink-0 flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/60 px-6 py-2.5">
          {/* Email reveal */}
          {candidate.emailRevealed && candidate.email ? (
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center gap-1.5 rounded border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-50"
            >
              <Mail size={12} />
              {candidate.email}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onRevealEmail(candidate.id)}
              className="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-neutral-300"
            >
              <Lock size={11} />
              Show email
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-400">1 credit</span>
            </button>
          )}

          {/* LinkedIn */}
          {candidate.linkedinUrl && (
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-neutral-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin size={12} />
              LinkedIn
            </a>
          )}

          <div className="flex-1" />

          <span className="text-xs text-neutral-400">
            via <span className="font-medium text-neutral-600">People Data Labs</span>
          </span>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6">
          <Separator className="mb-0" />

          {/* AI insight */}
          {candidate.aiSummary && (
            <DrawerSection title="AI insight">
              <div className="rounded-xl border border-navy-100 bg-navy-50 px-4 py-3.5">
                <p className="text-sm leading-relaxed text-navy-700">
                  {candidate.aiSummary}
                </p>
              </div>
            </DrawerSection>
          )}

          <Separator />

          {/* Fit criteria */}
          {candidate.fitCriteria.length > 0 && (
            <DrawerSection title={`Fit criteria — ${metCount}/${totalCount} met`}>
              <div className="flex flex-col gap-3">
                {candidate.fitCriteria.map((c, i) => (
                  <CriteriaItem
                    key={i}
                    criterion={c.criterion}
                    met={c.met}
                    evidence={c.evidence}
                  />
                ))}
              </div>
            </DrawerSection>
          )}

          <Separator />

          {/* Work history */}
          {candidate.workHistory.length > 0 && (
            <DrawerSection title="Work history">
              <div>
                {candidate.workHistory.map((w, i) => (
                  <WorkItem
                    key={i}
                    title={w.title}
                    company={w.company}
                    startDate={w.startDate}
                    endDate={w.endDate}
                    location={w.location}
                    summary={w.summary}
                    isLast={i === candidate.workHistory.length - 1}
                  />
                ))}
              </div>
            </DrawerSection>
          )}

          <Separator />

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <DrawerSection title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </DrawerSection>
          )}

          <Separator />

          {/* Education */}
          {candidate.education.length > 0 && (
            <DrawerSection title="Education">
              <div className="flex flex-col gap-3">
                {candidate.education.map((e, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-neutral-900">{e.school}</p>
                    <p className="text-xs text-neutral-500">
                      {e.degree} in {e.field} · {e.graduationYear}
                    </p>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          <Separator />

          {/* Move stage */}
          <DrawerSection title="Move stage">
            <StageMoveMenu
              currentStage={stage}
              onMove={(newStage) => onStageChange(candidate.id, newStage)}
            />
          </DrawerSection>

          <Separator />

          {/* Recruiter notes */}
          <DrawerSection title="Recruiter notes">
            <Textarea
              placeholder="Add private notes about this candidate — only visible to your team…"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteSaved(false);
              }}
              rows={3}
            />
            {note.trim() && (
              <div className="mt-2 flex items-center justify-between">
                {noteSaved && (
                  <span className="flex items-center gap-1 text-xs text-teal-600">
                    <CheckCircle2 size={12} /> Saved
                  </span>
                )}
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={handleSaveNote}>
                    Save note
                  </Button>
                </div>
              </div>
            )}
          </DrawerSection>

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
