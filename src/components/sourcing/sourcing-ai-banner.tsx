interface SourcingAiBannerProps {
  matchCount: number;
  visibleCount: number;
}

export function SourcingAiBanner({ matchCount, visibleCount }: SourcingAiBannerProps) {
  return (
    <div className="flex items-center gap-3 border-b border-navy-100 bg-navy-50 px-8 py-2.5">
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-teal-500"
        style={{ animation: "pulse 2s ease-in-out infinite" }}
      />
      <p className="text-xs text-navy-700">
        <strong>
          AI found candidates matching your role, location, and skill priorities.
        </strong>{" "}
        Showing top {visibleCount} of {matchCount.toLocaleString()} by fit score —
        refine filters to improve results.
      </p>
    </div>
  );
}
