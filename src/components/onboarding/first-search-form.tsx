"use client";

import { useState } from "react";
import { Link2, Upload, Database, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "./field-group";
import { cn } from "@/lib/utils";

export interface FirstSearchData {
  jobTitle: string;
  jobDescription: string;
  location: string;
  remoteOk: boolean;
  skills: string[];
  minYearsExp: number | null;
  maxYearsExp: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
}

interface FirstSearchFormProps {
  value: FirstSearchData;
  onChange: (data: FirstSearchData) => void;
  errors?: Partial<Record<keyof FirstSearchData, string>>;
}

const SUGGESTED_SKILLS = [
  "TypeScript", "Go", "Python", "React", "Node.js", "Kubernetes",
  "AWS", "PostgreSQL", "Distributed Systems", "ML / AI", "Product Strategy",
  "B2B SaaS", "Design Systems", "User Research",
];

const EXP_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Any", value: null },
  { label: "1+", value: 1 },
  { label: "3+", value: 3 },
  { label: "5+", value: 5 },
  { label: "8+", value: 8 },
  { label: "10+", value: 10 },
];

function ImportOption({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
    >
      <span className="text-neutral-400">{icon}</span>
      {label}
    </button>
  );
}

function SkillToggle({
  skill,
  selected,
  onToggle,
}: {
  skill: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        selected
          ? "border-teal-500 bg-teal-50 text-teal-700"
          : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
      )}
    >
      {selected ? "✓ " : ""}{skill}
    </button>
  );
}

export function FirstSearchForm({ value, onChange, errors }: FirstSearchFormProps) {
  const [skillInput, setSkillInput] = useState("");

  const set = <K extends keyof FirstSearchData>(k: K, v: FirstSearchData[K]) =>
    onChange({ ...value, [k]: v });

  function toggleSkill(skill: string) {
    const next = value.skills.includes(skill)
      ? value.skills.filter((s) => s !== skill)
      : [...value.skills, skill];
    set("skills", next);
  }

  function addCustomSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !value.skills.includes(trimmed)) {
      set("skills", [...value.skills, trimmed]);
    }
    setSkillInput("");
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Import shortcuts */}
      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500">
          Import from an existing source
        </p>
        <div className="flex flex-wrap gap-2">
          <ImportOption icon={<Link2 size={14} />} label="Import from URL" onClick={() => {}} />
          <ImportOption icon={<Upload size={14} />} label="Upload PDF / DOCX" onClick={() => {}} />
          <ImportOption icon={<Database size={14} />} label="Import from ATS" onClick={() => {}} />
        </div>
      </div>

      {/* Job title */}
      <FieldGroup label="Job title" hint="Be specific — this drives how the AI scores candidate fit.">
        <Input
          placeholder="e.g. Staff Software Engineer, Platform Infrastructure"
          value={value.jobTitle}
          onChange={(e) => set("jobTitle", e.target.value)}
          error={errors?.jobTitle}
          autoFocus
        />
      </FieldGroup>

      {/* Job description */}
      <FieldGroup
        label="Job description"
        hint="Paste the full JD or write a brief summary. AI extracts requirements automatically."
      >
        <Textarea
          placeholder="We are looking for an experienced engineer to join our platform team. You will own the infrastructure powering our core product..."
          value={value.jobDescription}
          onChange={(e) => set("jobDescription", e.target.value)}
          rows={5}
          error={errors?.jobDescription}
        />
      </FieldGroup>

      {/* Location + remote */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Location">
          <Input
            placeholder="San Francisco, CA"
            value={value.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </FieldGroup>
        <FieldGroup label="Remote">
          <div className="flex h-9 items-center gap-3">
            {(["Remote OK", "On-site only"] as const).map((opt) => {
              const isRemote = opt === "Remote OK";
              const active = value.remoteOk === isRemote;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set("remoteOk", isRemote)}
                  className={cn(
                    "rounded-lg border px-3.5 py-1.5 text-sm transition-colors",
                    active
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </FieldGroup>
      </div>

      {/* Skills */}
      <FieldGroup
        label="Key skills & tools"
        hint="Select from suggestions or add your own. These are weighted in AI scoring."
      >
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.map((s) => (
            <SkillToggle
              key={s}
              skill={s}
              selected={value.skills.includes(s)}
              onToggle={() => toggleSkill(s)}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="Add a skill..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); }
            }}
            className="flex-1"
          />
          <Button variant="outline" size="md" onClick={addCustomSkill} disabled={!skillInput.trim()}>
            Add
          </Button>
        </div>
        {value.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {value.skills
              .filter((s) => !SUGGESTED_SKILLS.includes(s))
              .map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs text-teal-700"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => set("skills", value.skills.filter((x) => x !== s))}
                    className="text-teal-400 hover:text-teal-700"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        )}
      </FieldGroup>

      {/* Years of experience */}
      <FieldGroup label="Minimum years of experience">
        <div className="flex flex-wrap gap-2">
          {EXP_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => set("minYearsExp", opt.value)}
              className={cn(
                "rounded-lg border px-4 py-1.5 text-sm transition-colors",
                value.minYearsExp === opt.value
                  ? "border-teal-500 bg-teal-50 text-teal-700 font-medium"
                  : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      {/* AI readiness callout */}
      <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 px-4 py-3.5">
        <Zap size={16} className="mt-0.5 shrink-0 text-teal-500" />
        <p className="text-sm text-navy-700">
          <span className="font-medium">AI is ready to start sourcing.</span>{" "}
          Once you continue, we'll match your role against 1M+ profiles and
          prepare your first shortlist in seconds.
        </p>
      </div>
    </div>
  );
}
