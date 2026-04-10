import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-100",
        className
      )}
    />
  );
}

function CandidateCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <Skeleton className="mb-2 h-3 w-20" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="mt-1.5 h-3 w-28" />
    </div>
  );
}

export { Skeleton, CandidateCardSkeleton, StatCardSkeleton };
