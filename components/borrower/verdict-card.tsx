import { CircleAlert, CircleCheck } from "lucide-react";
import type { FeasibilityResult } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { RiskBadge } from "@/components/shared/risk-badge";
import { formatINR } from "@/components/shared/format";

export function VerdictCard({ result, borrowerName }: { result: FeasibilityResult; borrowerName: string }) {
  const recommended = result.verdict === "RECOMMENDED";
  const Icon = recommended ? CircleCheck : CircleAlert;
  return (
    <section
      aria-labelledby="verdict-heading"
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
        recommended ? "border-success/25 bg-success-soft" : "border-warning/25 bg-warning-soft",
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("mt-0.5 size-5 shrink-0", recommended ? "text-success" : "text-warning")}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1">
          <h2
            id="verdict-heading"
            className={cn("text-lg font-semibold tracking-tight", recommended ? "text-success" : "text-warning")}
          >
            {recommended ? "Recommended" : "Not recommended"}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-foreground/80">
            {recommended
              ? `${borrowerName}'s requested repayment fits comfortably within their monthly capacity.`
              : `The requested repayment is too high for ${borrowerName}'s cash flow. A loan of ${formatINR(result.recommendedAmount)} fits safely.`}
          </p>
        </div>
      </div>
      <RiskBadge level={result.riskLevel} score={result.riskScore} className="self-start sm:self-center" />
    </section>
  );
}
