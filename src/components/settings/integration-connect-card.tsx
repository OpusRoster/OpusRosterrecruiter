"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IntegrationStatus } from "@/types";

interface IntegrationConnectCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  status: IntegrationStatus;
  comingSoon?: boolean;
  docsUrl?: string;
  onConnect: () => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

export function IntegrationConnectCard({
  icon,
  title,
  description,
  category,
  status: externalStatus,
  comingSoon,
  docsUrl,
  onConnect,
  onDisconnect,
}: IntegrationConnectCardProps) {
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<IntegrationStatus>(externalStatus);

  async function handleConnect() {
    setLoading(true);
    try {
      await onConnect();
      setLocalStatus("connected");
    } catch {
      setLocalStatus("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    if (!onDisconnect) return;
    setLoading(true);
    try {
      await onDisconnect();
      setLocalStatus("disconnected");
    } catch {
      setLocalStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-white px-5 py-4 transition-colors",
        localStatus === "connected" && "border-teal-200",
        localStatus === "error" && "border-red-200",
        localStatus === "disconnected" && "border-neutral-200",
        comingSoon && "opacity-60"
      )}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-xl">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          <Badge variant="default" size="sm">{category}</Badge>
          {comingSoon && <Badge variant="soon" size="sm">Coming soon</Badge>}
        </div>
        <p className="mt-0.5 text-xs text-neutral-400 leading-relaxed">{description}</p>
      </div>

      {/* Status + action */}
      <div className="flex shrink-0 items-center gap-2">
        {docsUrl && !comingSoon && (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 transition-colors hover:text-neutral-500"
          >
            <ExternalLink size={13} />
          </a>
        )}

        {comingSoon ? (
          <span className="text-xs text-neutral-400">Coming soon</span>
        ) : localStatus === "connected" ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-teal-600">
              <CheckCircle2 size={13} /> Connected
            </span>
            {onDisconnect && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                loading={loading}
                className="text-neutral-400 hover:text-red-500"
              >
                Disconnect
              </Button>
            )}
          </div>
        ) : localStatus === "error" ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={12} /> Failed
            </span>
            <Button variant="danger" size="sm" onClick={handleConnect} loading={loading}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Loader2 size={13} className="animate-spin" /> Connecting…
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleConnect}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
