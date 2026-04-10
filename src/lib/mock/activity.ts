import type { ActivityEvent } from "@/components/dashboard/activity-feed";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "evt_001",
    actor: "AI",
    action: "sourced 48 new candidates for",
    target: "Staff Engineer, Platform",
    timestamp: ago(2),
    type: "ai",
  },
  {
    id: "evt_002",
    actor: "You",
    action: "shortlisted",
    target: "Priya Nambiar",
    timestamp: ago(18),
    type: "shortlist",
  },
  {
    id: "evt_003",
    actor: "You",
    action: "shortlisted",
    target: "Marcus Webb",
    timestamp: ago(22),
    type: "shortlist",
  },
  {
    id: "evt_004",
    actor: "AI",
    action: "sourced 112 candidates for",
    target: "Senior Product Designer",
    timestamp: ago(65),
    type: "ai",
  },
  {
    id: "evt_005",
    actor: "You",
    action: "created search:",
    target: "Director of Revenue Operations",
    timestamp: ago(180),
    type: "system",
  },
  {
    id: "evt_006",
    actor: "AI",
    action: "completed sourcing batch for",
    target: "Staff Engineer, Platform",
    timestamp: ago(1440),
    type: "ai",
  },
];
