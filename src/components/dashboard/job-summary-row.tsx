import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";

interface JobSummaryRowProps {
  job: Job;
  shortlisted?: number;
  avgFit?: number;
}

export function JobSummaryRow({ job, shortlisted = 0, avgFit }: JobSummaryRowProps) {
  return (
    <Link
      href={`/sourcing/${job.id}`}
      className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-neutral-50"
    >
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700 text-sm font-medium">
        {job.title.charAt(0)}
      </div>

      {/* Title + location */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-neutral-900">{job.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={11} className="shrink-0 text-neutral-400" />
          <p className="truncate text-xs text-neutral-400">{job.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex shrink-0 items-center gap-5">
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-900">
            {job.matchCount.toLocaleString()}
          </p>
          <p className="text-2xs text-neutral-400">matches</p>
        </div>
        <div className="text-right">
          <p className={cn("text-sm font-medium", shortlisted > 0 ? "text-teal-600" : "text-neutral-400")}>
            {shortlisted}
          </p>
          <p className="text-2xs text-neutral-400">shortlisted</p>
        </div>
        {avgFit !== undefined && (
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900">{avgFit}</p>
            <p className="text-2xs text-neutral-400">avg fit</p>
          </div>
        )}
        <Badge variant={job.status === "active" ? "teal" : "warning"}>
          {job.status}
        </Badge>
      </div>
    </Link>
  );
}
