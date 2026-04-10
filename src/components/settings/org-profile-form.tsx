"use client";

import { useState } from "react";
import { Building2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { Organization } from "@/types";

type TeamSize = "1-2" | "3-10" | "10+";

interface OrgProfileFormProps {
  org: Pick<Organization, "name" | "domain" | "teamSize" | "logoUrl">;
  onSave: (data: { name: string; domain: string; teamSize: TeamSize }) => Promise<void>;
}

export function OrgProfileForm({ org, onSave }: OrgProfileFormProps) {
  const [name, setName] = useState(org.name);
  const [domain, setDomain] = useState(org.domain ?? "");
  const [teamSize, setTeamSize] = useState<TeamSize>(org.teamSize ?? "3-10");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({ name, domain, teamSize });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isDirty =
    name !== org.name ||
    domain !== (org.domain ?? "") ||
    teamSize !== (org.teamSize ?? "3-10");

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Avatar
          initials={name.slice(0, 2).toUpperCase()}
          color="#1D3557"
          size="xl"
        />
        <div>
          <p className="text-sm font-medium text-neutral-700">Company logo</p>
          <p className="mt-0.5 text-xs text-neutral-400">
            Shown in outreach emails and your client portal
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Upload logo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<Building2 size={13} />}
        />
        <Input
          label="Company domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value.toLowerCase())}
          leftIcon={<Globe size={13} />}
          hint="e.g. acmecorp.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-800">
          Recruiting team size
        </label>
        <div className="flex gap-2">
          {(["1-2", "3-10", "10+"] as TeamSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setTeamSize(size)}
              className={`rounded-lg border px-5 py-2 text-sm transition-colors ${
                teamSize === size
                  ? "border-teal-500 bg-teal-50 font-medium text-teal-700"
                  : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
        {saved && (
          <span className="text-xs text-teal-600">✓ Saved</span>
        )}
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          disabled={!isDirty || saving}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
