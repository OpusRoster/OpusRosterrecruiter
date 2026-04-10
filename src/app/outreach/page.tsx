"use client";
import { useState } from "react";
import { Play, Pause, Mail, Linkedin, MessageSquare, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SequenceStatus = "active" | "paused" | "draft";

interface SequenceStep {
  day: number;
  type: "email" | "linkedin" | "sms";
  label: string;
}

interface Sequence {
  id: string;
  name: string;
  jobTitle: string;
  status: SequenceStatus;
  steps: SequenceStep[];
  stats: {
    enrolled: number;
    sent: number;
    replied: number;
    interested: number;
  };
  replyRate: number;
}

const MOCK_SEQUENCES: Sequence[] = [
  {
    id: "seq_001",
    name: "Senior Engineer Outreach",
    jobTitle: "Staff Engineer, Platform",
    status: "active",
    steps: [
      { day: 1,  type: "email",    label: "Email Day 1" },
      { day: 3,  type: "linkedin", label: "LinkedIn Day 3" },
      { day: 7,  type: "email",    label: "Follow-up Day 7" },
      { day: 12, type: "linkedin", label: "InMail Day 12" },
    ],
    stats: { enrolled: 48, sent: 38, replied: 7, interested: 3 },
    replyRate: 18,
  },
  {
    id: "seq_002",
    name: "Product Designer Outreach",
    jobTitle: "Senior Product Designer",
    status: "paused",
    steps: [
      { day: 1, type: "email",    label: "Email Day 1" },
      { day: 4, type: "linkedin", label: "LinkedIn Day 4" },
      { day: 8, type: "email",    label: "Follow-up Day 8" },
    ],
    stats: { enrolled: 22, sent: 15, replied: 2, interested: 1 },
    replyRate: 9,
  },
  {
    id: "seq_003",
    name: "RevOps Director Outreach",
    jobTitle: "Director of Revenue Operations",
    status: "draft",
    steps: [
      { day: 1, type: "email",    label: "Email Day 1" },
      { day: 3, type: "linkedin", label: "LinkedIn Day 3" },
    ],
    stats: { enrolled: 0, sent: 0, replied: 0, interested: 0 },
    replyRate: 0,
  },
];

const STEP_ICONS = {
  email:    <Mail size={12} />,
  linkedin: <Linkedin size={12} />,
  sms:      <MessageSquare size={12} />,
};

const STEP_COLORS = {
  email:    "bg-navy-50 text-navy-700 border-navy-200",
  linkedin: "bg-blue-50 text-blue-700 border-blue-200",
  sms:      "bg-teal-50 text-teal-700 border-teal-200",
};

const STATUS_CONFIG: Record<SequenceStatus, { variant: "teal" | "warning" | "default"; label: string }> = {
  active: { variant: "teal",    label: "Active" },
  paused: { variant: "warning", label: "Paused" },
  draft:  { variant: "default", label: "Draft" },
};

function StatBox({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className={cn("text-lg font-semibold tracking-tight", highlight ? "text-teal-600" : "text-neutral-900")}>
        {value}
      </p>
      <p className="text-2xs text-neutral-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function OutreachPage() {
  const [sequences, setSequences] = useState<Sequence[]>(MOCK_SEQUENCES);

  function toggleStatus(id: string) {
    setSequences((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s
      )
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Outreach"
        subtitle={`${sequences.filter((s) => s.status === "active").length} active sequences`}
        actions={
          <Button variant="primary">+ New sequence</Button>
        }
      />

      {/* Tab bar */}
      <div className="shrink-0 border-b border-neutral-200 bg-white px-8 flex items-end gap-0">
        {(["All", "Active", "Paused", "Draft"] as const).map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "border-b-2 px-4 pb-3 pt-1 text-sm transition-colors",
              i === 0
                ? "border-navy-800 font-medium text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            {tab}
            <span className={cn(
              "ml-1.5 rounded-full px-1.5 py-0.5 text-2xs font-semibold",
              i === 0 ? "bg-navy-800 text-white" : "bg-neutral-100 text-neutral-500"
            )}>
              {tab === "All" ? sequences.length :
               tab === "Active" ? sequences.filter((s) => s.status === "active").length :
               tab === "Paused" ? sequences.filter((s) => s.status === "paused").length :
               sequences.filter((s) => s.status === "draft").length}
            </span>
          </button>
        ))}
      </div>

      {/* Sequence list */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        <div className="max-w-4xl flex flex-col gap-3">
          {sequences.map((seq) => {
            const statusCfg = STATUS_CONFIG[seq.status];
            return (
              <div key={seq.id} className={cn(
                "rounded-xl border bg-white transition-shadow hover:shadow-sm",
                seq.status === "paused" ? "border-amber-200" : "border-neutral-200"
              )}>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-neutral-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <p className="text-sm font-semibold text-neutral-900">{seq.name}</p>
                      <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    </div>
                    <p className="text-xs text-neutral-400">
                      For: <span className="font-medium text-neutral-600">{seq.jobTitle}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {seq.status !== "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(seq.id)}
                        className="gap-1.5"
                      >
                        {seq.status === "active"
                          ? <><Pause size={12} /> Pause</>
                          : <><Play size={12} /> Resume</>
                        }
                      </Button>
                    )}
                    {seq.status === "draft" && (
                      <Button variant="primary" size="sm">Launch</Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-100">
                  {seq.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                        STEP_COLORS[step.type]
                      )}>
                        {STEP_ICONS[step.type]}
                        {step.label}
                      </div>
                      {i < seq.steps.length - 1 && (
                        <ChevronRight size={12} className="text-neutral-300 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 divide-x divide-neutral-100 px-5 py-3">
                  <StatBox label="Enrolled" value={seq.stats.enrolled} />
                  <StatBox label="Sent" value={seq.stats.sent} />
                  <StatBox label="Replied" value={seq.stats.replied} highlight={seq.stats.replied > 0} />
                  <div className="text-center">
                    <p className={cn("text-lg font-semibold tracking-tight", seq.replyRate >= 15 ? "text-teal-600" : "text-neutral-900")}>
                      {seq.replyRate}%
                    </p>
                    <p className="text-2xs text-neutral-400 mt-0.5">Reply rate</p>
                  </div>
                </div>

                {/* Paused warning */}
                {seq.status === "paused" && (
                  <div className="flex items-center gap-2 border-t border-amber-100 bg-amber-50 px-5 py-2.5 rounded-b-xl">
                    <p className="text-xs text-amber-700">
                      <span className="font-medium">Sequence paused.</span> Resume to continue sending to enrolled candidates.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
