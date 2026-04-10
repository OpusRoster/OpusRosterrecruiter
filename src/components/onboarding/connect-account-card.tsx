"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface ConnectAccountCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onConnect: () => Promise<void>;
  status?: ConnectionStatus;
}

export function ConnectAccountCard({
  icon,
  title,
  description,
  badge,
  onConnect,
  status: externalStatus,
}: ConnectAccountCardProps) {
  const [internalStatus, setInternalStatus] = useState<ConnectionStatus>("idle");
  const status = externalStatus ?? internalStatus;

  async function handleClick() {
    if (status === "connected") return;
    setInternalStatus("connecting");
    try {
      await onConnect();
      setInternalStatus("connected");
    } catch {
      setInternalStatus("error");
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-white px-5 py-4 transition-colors",
        status === "connected" && "border-teal-300 bg-teal-50/40",
        status === "error" && "border-red-200 bg-red-50/40",
        status === "idle" && "border-neutral-200 hover:border-neutral-300"
      )}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-xl">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          {badge && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-2xs font-medium text-neutral-500">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-neutral-400">{description}</p>
      </div>

      {/* Status / action */}
      <div className="shrink-0">
        {status === "connected" && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600">
            <CheckCircle2 size={15} />
            Connected
          </div>
        )}
        {status === "connecting" && (
          <div className="flex items-center gap-1.5 text-sm text-neutral-400">
            <Loader2 size={14} className="animate-spin" />
            Connecting…
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={13} />
              Failed
            </div>
            <Button variant="outline" size="sm" onClick={handleClick}>
              Retry
            </Button>
          </div>
        )}
        {status === "idle" && (
          <Button variant="outline" size="sm" onClick={handleClick}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
