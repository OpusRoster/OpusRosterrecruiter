import { cn, relativeTime } from "@/lib/utils";

export interface ActivityEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  targetHref?: string;
  timestamp: string;
  type: "ai" | "shortlist" | "stage" | "outreach" | "system";
}

const TYPE_STYLES: Record<ActivityEvent["type"], { bg: string; text: string; symbol: string }> = {
  ai:        { bg: "bg-purple-50",  text: "text-purple-600", symbol: "✦" },
  shortlist: { bg: "bg-teal-50",    text: "text-teal-600",   symbol: "★" },
  stage:     { bg: "bg-amber-50",   text: "text-amber-600",  symbol: "→" },
  outreach:  { bg: "bg-navy-50",    text: "text-navy-700",   symbol: "✉" },
  system:    { bg: "bg-neutral-100", text: "text-neutral-500", symbol: "·" },
};

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="flex flex-col">
      {events.map((event) => {
        const style = TYPE_STYLES[event.type];
        return (
          <div
            key={event.id}
            className="flex items-start gap-3 border-b border-neutral-100 px-5 py-3 last:border-b-0"
          >
            <div
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs",
                style.bg,
                style.text
              )}
            >
              {style.symbol}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-700">
                <span className="font-medium text-neutral-900">{event.actor}</span>{" "}
                {event.action}{" "}
                <span className="font-medium text-navy-700">{event.target}</span>
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">
                {relativeTime(event.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
