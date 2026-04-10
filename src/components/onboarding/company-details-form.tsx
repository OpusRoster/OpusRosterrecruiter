"use client";

import { useState, useCallback } from "react";
import { Building2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldGroup } from "./field-group";
import { cn } from "@/lib/utils";

export type TeamSize = "1-2" | "3-10" | "10+";

export interface CompanyDetailsData {
  name: string;
  domain: string;
  teamSize: TeamSize | null;
  logoFile: File | null;
}

interface CompanyDetailsFormProps {
  value: CompanyDetailsData;
  onChange: (data: CompanyDetailsData) => void;
  errors?: Partial<Record<keyof CompanyDetailsData, string>>;
}

const TEAM_SIZE_OPTIONS: { value: TeamSize; label: string; description: string }[] = [
  { value: "1-2",  label: "1–2",   description: "Solo or duo" },
  { value: "3-10", label: "3–10",  description: "Small team" },
  { value: "10+",  label: "10+",   description: "Larger team" },
];

function LogoUpload({
  file,
  onFileChange,
}: {
  file: File | null;
  onFileChange: (f: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && dropped.type.startsWith("image/")) onFileChange(dropped);
    },
    [onFileChange]
  );

  return (
    <div
      className={cn(
        "relative flex h-24 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors",
        dragging
          ? "border-teal-400 bg-teal-50"
          : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("logo-input")?.click()}
    >
      <input
        id="logo-input"
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          if (f) onFileChange(f);
        }}
      />
      {preview ? (
        <div className="flex items-center gap-3">
          <img src={preview} alt="Logo preview" className="h-12 w-12 rounded-lg object-contain" />
          <div className="text-left">
            <p className="text-sm font-medium text-neutral-700">{file?.name}</p>
            <button
              type="button"
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-neutral-400">
          <Upload size={18} />
          <p className="text-xs">Drop logo or click to upload</p>
          <p className="text-2xs text-neutral-300">PNG, SVG, JPG · max 2 MB</p>
        </div>
      )}
    </div>
  );
}

export function CompanyDetailsForm({ value, onChange, errors }: CompanyDetailsFormProps) {
  const set = <K extends keyof CompanyDetailsData>(k: K, v: CompanyDetailsData[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup label="Company name" hint="This appears in candidate-facing emails and your client portal.">
        <Input
          placeholder="Acme Corp"
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors?.name}
          leftIcon={<Building2 size={14} />}
          autoFocus
        />
      </FieldGroup>

      <FieldGroup
        label="Company domain"
        hint="We'll use this to verify your work email and auto-fill company details."
      >
        <Input
          placeholder="acmecorp.com"
          value={value.domain}
          onChange={(e) => set("domain", e.target.value.toLowerCase().replace(/^https?:\/\//, ""))}
          error={errors?.domain}
        />
      </FieldGroup>

      <FieldGroup label="Recruiting team size">
        <div className="grid grid-cols-3 gap-2">
          {TEAM_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("teamSize", opt.value)}
              className={cn(
                "flex flex-col items-center rounded-xl border py-4 text-sm transition-colors",
                value.teamSize === opt.value
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
              )}
            >
              <span className="text-lg font-medium">{opt.label}</span>
              <span className="mt-0.5 text-xs text-neutral-400">{opt.description}</span>
            </button>
          ))}
        </div>
        {errors?.teamSize && (
          <p className="text-xs text-red-600">{errors.teamSize}</p>
        )}
      </FieldGroup>

      <FieldGroup label="Company logo" hint="Optional — shown in outreach emails and your workspace.">
        <LogoUpload
          file={value.logoFile}
          onFileChange={(f) => set("logoFile", f)}
        />
      </FieldGroup>
    </div>
  );
}
