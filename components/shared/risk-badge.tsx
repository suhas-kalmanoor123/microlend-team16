import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { FeasibilityResult } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { riskLevelLabel } from "@/components/shared/format";

const tone: Record<FeasibilityResult["riskLevel"], string> = {
  LOW: "border-success/25 bg-success-soft text-success",
  LOW_MEDIUM: "border-success/25 bg-success-soft text-success",
  MEDIUM: "border-warning/25 bg-warning-soft text-warning",
  HIGH: "border-destructive/25 bg-destructive/10 text-destructive",
};

export function RiskBadge({
  level,
  score,
  className,
}: {
  level: FeasibilityResult["riskLevel"];
  score?: number;
  className?: string;
}) {
  const Icon = level === "LOW" || level === "LOW_MEDIUM" ? ShieldCheck : ShieldAlert;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone[level],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {riskLevelLabel[level]}
      {typeof score === "number" ? (
        <span className="font-mono opacity-80">· {score}/100</span>
      ) : null}
    </span>
  );
}
