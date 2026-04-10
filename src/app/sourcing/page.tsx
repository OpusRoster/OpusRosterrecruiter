import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_JOBS } from "@/lib/mock/candidates";

export default function SourcingPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader title="Sourcing" subtitle={`${MOCK_JOBS.length} active searches`}
        actions={<Link href="/onboarding/search"><Button variant="primary">+ New search</Button></Link>} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl space-y-3">
          {MOCK_JOBS.map((job) => (
            <Link key={job.id} href={`/sourcing/${job.id}`} className="block">
              <div className="group rounded-xl border border-neutral-200 bg-white px-6 py-4 transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <p className="text-base font-semibold text-neutral-900 group-hover:text-teal-700 transition-colors">{job.title}</p>
                      <Badge variant={job.status === "active" ? "teal" : "warning"}>{job.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      {job.location && <span className="flex items-center gap-1 text-xs text-neutral-400"><MapPin size={11}/>{job.location}</span>}
                      {job.skills.length > 0 && <span className="text-xs text-neutral-400">{job.skills.slice(0, 3).join(" · ")}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-6 text-right">
                    <div><p className="text-lg font-semibold tracking-tight text-neutral-900">{job.matchCount.toLocaleString()}</p><p className="text-2xs text-neutral-400">matched</p></div>
                    <div><p className="text-lg font-semibold tracking-tight text-teal-600">0</p><p className="text-2xs text-neutral-400">shortlisted</p></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
