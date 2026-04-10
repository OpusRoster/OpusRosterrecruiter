import { PageHeader } from "@/components/layout/page-header";
import { PipelineBoard } from "@/components/recruiter/pipeline-board";
import { Button } from "@/components/ui/button";
import { MOCK_JOBS, getMockSourcingResults } from "@/lib/mock/candidates";

function getAllResults() {
  return MOCK_JOBS.flatMap((job) =>
    getMockSourcingResults(job.id).map((r, i) => ({
      ...r,
      stage: i < 3 ? "sourced" as const : i < 5 ? "shortlisted" as const : i === 5 ? "contacted" as const : "sourced" as const,
    }))
  );
}

export default function PipelinePage() {
  const allResults = getAllResults();
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader title="Pipeline" subtitle={`${allResults.length} candidates across all stages`}
        actions={<Button variant="outline" size="sm">Export</Button>} />
      <div className="flex-1 overflow-hidden">
        <PipelineBoard initialResults={allResults} />
      </div>
    </div>
  );
}
