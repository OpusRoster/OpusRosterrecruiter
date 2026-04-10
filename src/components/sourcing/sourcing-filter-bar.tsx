"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortOption = "fit" | "recent" | "name";

interface ActiveFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

interface SourcingFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeFilters: ActiveFilter[];
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  onOpenFilters?: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "fit",    label: "Fit score" },
  { value: "recent", label: "Recently added" },
  { value: "name",   label: "Name" },
];

export function SourcingFilterBar({
  query,
  onQueryChange,
  activeFilters,
  sortBy,
  onSortChange,
  onOpenFilters,
}: SourcingFilterBarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-8 py-3">
      {/* Search */}
      <div className="w-56">
        <Input
          placeholder="Filter candidates…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          leftIcon={<Search size={13} />}
          className="h-8 text-xs"
        />
      </div>

      {/* Active filter chips */}
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {activeFilters.map((f) => (
          <span
            key={f.id}
            className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
          >
            {f.label}
            <button
              type="button"
              onClick={f.onRemove}
              className="text-teal-400 transition-colors hover:text-teal-700"
              aria-label={`Remove filter ${f.label}`}
            >
              ×
            </button>
          </span>
        ))}
        {onOpenFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenFilters}
            className="gap-1.5 text-neutral-500"
          >
            <SlidersHorizontal size={13} />
            Filters
          </Button>
        )}
      </div>

      {/* Sort */}
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-xs text-neutral-400">Sort:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSortChange(opt.value)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs transition-colors",
              sortBy === opt.value
                ? "border-teal-400 bg-teal-50 font-medium text-teal-700"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
