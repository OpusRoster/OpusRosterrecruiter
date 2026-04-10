"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AtsSystems {
  id: string;
  name: string;
  logo: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const ATS_SYSTEMS: AtsSystems[] = [
  { id: "greenhouse",  name: "Greenhouse",  logo: "🌱", popular: true },
  { id: "lever",       name: "Lever",       logo: "⚖️", popular: true },
  { id: "ashby",       name: "Ashby",       logo: "🔹", popular: true },
  { id: "workday",     name: "Workday",     logo: "☁️" },
  { id: "icims",       name: "iCIMS",       logo: "🔷" },
  { id: "bullhorn",    name: "Bullhorn",    logo: "📢" },
  { id: "jobvite",     name: "Jobvite",     logo: "💼" },
  { id: "taleo",       name: "Taleo",       logo: "🟠" },
  { id: "bamboo",      name: "BambooHR",    logo: "🎋" },
  { id: "rippling",    name: "Rippling",    logo: "〰️" },
  { id: "smartrecruit",name: "SmartRecruit",logo: "🎯", comingSoon: true },
  { id: "teamtailor",  name: "Teamtailor",  logo: "👥", comingSoon: true },
];

interface AtsModalProps {
  onClose: () => void;
  onConnect: (atsId: string) => Promise<void>;
}

export function AtsModal({ onClose, onConnect }: AtsModalProps) {
  const [query, setQuery] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());

  async function handleConnect(atsId: string) {
    setConnecting(atsId);
    try {
      await onConnect(atsId);
      setConnected((prev) => new Set([...prev, atsId]));
    } finally {
      setConnecting(null);
    }
  }

  const filtered = ATS_SYSTEMS.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );
  const popular = filtered.filter((s) => s.popular);
  const rest = filtered.filter((s) => !s.popular);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal
        aria-label="Connect ATS"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Connect your ATS</h2>
            <p className="mt-0.5 text-xs text-neutral-400">
              120+ systems via Merge.dev · Bi-directional sync
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-100"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-neutral-100 px-6 py-3">
          <Input
            placeholder="Search ATS systems…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search size={13} />}
            className="h-8 text-xs"
            autoFocus
          />
        </div>

        {/* ATS list */}
        <div className="max-h-96 overflow-y-auto px-6 py-4">
          {popular.length > 0 && !query && (
            <>
              <p className="mb-2 text-2xs font-semibold uppercase tracking-widest text-neutral-400">
                Popular
              </p>
              <div className="mb-4 grid grid-cols-3 gap-2">
                {popular.map((s) => (
                  <AtsOption
                    key={s.id}
                    system={s}
                    isConnected={connected.has(s.id)}
                    isConnecting={connecting === s.id}
                    onConnect={() => handleConnect(s.id)}
                  />
                ))}
              </div>
            </>
          )}

          {(query ? filtered : rest).length > 0 && (
            <>
              {!query && (
                <p className="mb-2 text-2xs font-semibold uppercase tracking-widest text-neutral-400">
                  All systems
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {(query ? filtered : rest).map((s) => (
                  <AtsOption
                    key={s.id}
                    system={s}
                    isConnected={connected.has(s.id)}
                    isConnecting={connecting === s.id}
                    onConnect={() => handleConnect(s.id)}
                  />
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-neutral-500">No ATS found for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs text-neutral-400">
                Contact support to request an integration.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 px-6 py-3 text-right">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Individual ATS option tile ───────────────────────────────────────────────

interface AtsOptionProps {
  system: AtsSystems;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
}

function AtsOption({ system, isConnected, isConnecting, onConnect }: AtsOptionProps) {
  return (
    <button
      type="button"
      onClick={!system.comingSoon && !isConnected ? onConnect : undefined}
      disabled={system.comingSoon || isConnecting}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors",
        isConnected
          ? "border-teal-300 bg-teal-50"
          : system.comingSoon
          ? "cursor-default border-neutral-100 bg-neutral-50 opacity-50"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
      )}
    >
      <span className="text-2xl">{system.logo}</span>
      <span className="text-xs font-medium text-neutral-700">{system.name}</span>
      {isConnected && (
        <span className="text-2xs font-medium text-teal-600">✓ Connected</span>
      )}
      {isConnecting && (
        <span className="text-2xs text-neutral-400">Connecting…</span>
      )}
      {system.comingSoon && !isConnected && !isConnecting && (
        <span className="text-2xs text-neutral-400">Soon</span>
      )}
    </button>
  );
}
