import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { avatarColor } from "@/lib/utils";
import type { User, UserRole } from "@/types";

interface SeatSummaryCardProps {
  members: User[];
  seatsUsed: number;
  seatsTotal: number;
  onInvite: () => void;
}

const ROLE_BADGE: Record<UserRole, { label: string; variant: "navy" | "default" | "teal" }> = {
  owner:     { label: "Owner",     variant: "navy" },
  admin:     { label: "Admin",     variant: "teal" },
  recruiter: { label: "Recruiter", variant: "default" },
  viewer:    { label: "Viewer",    variant: "default" },
};

export function SeatSummaryCard({ members, seatsUsed, seatsTotal, onInvite }: SeatSummaryCardProps) {
  return (
    <div className="flex flex-col gap-0">
      {/* Header row */}
      <div className="flex items-center justify-between pb-3">
        <p className="text-xs text-neutral-500">
          <span className="font-semibold text-neutral-800">{seatsUsed}</span> of{" "}
          <span className="font-semibold text-neutral-800">{seatsTotal}</span> seats used
        </p>
        <Button variant="outline" size="sm" onClick={onInvite}>
          + Invite member
        </Button>
      </div>

      {/* Member list */}
      <div className="flex flex-col">
        {members.map((member, i) => {
          const badge = ROLE_BADGE[member.role];
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 border-t border-neutral-100 py-3 first:border-t-0"
            >
              <Avatar
                initials={(member.fullName ?? member.email).slice(0, 2).toUpperCase()}
                color={avatarColor(i)}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {member.fullName ?? member.email}
                </p>
                <p className="text-xs text-neutral-400">{member.email}</p>
              </div>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
