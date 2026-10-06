"use client";

import { motion } from "framer-motion";
import type { FeasibilityResult, LoanRequest } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { formatINR } from "@/components/shared/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function CapacityBar({ request, result }: { request: LoanRequest; result: FeasibilityResult }) {
  const capacity = result.monthlyRepaymentCapacity;
  const safeLimit = capacity * 0.5;
  const requested = Math.round(request.amount / request.tenureMonths);
  const scale = Math.max(capacity, requested, 1);
  const exceeds = requested > safeLimit;

  const rows = [
    { label: "Monthly repayment capacity", value: capacity, bar: "bg-border-strong" },
    { label: "Requested monthly payment", value: requested, bar: exceeds ? "bg-warning" : "bg-success" },
  ];

  return (
    <section aria-labelledby="capacity-heading" className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="capacity-heading" className="text-sm font-medium text-foreground">
          Repayment capacity vs requested payment
        </h2>
        <span className="text-xs text-muted-foreground">
          Safe limit is 50% of capacity · <span className="font-mono text-foreground">{formatINR(safeLimit)}</span>
        </span>
      </div>

      <div className="relative flex flex-col gap-4">
        {rows.map((row, index) => (
          <div key={row.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-mono font-medium tabular-nums text-foreground">{formatINR(row.value)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn("h-full rounded-full", row.bar)}
                initial={{ width: 0 }}
                animate={{ width: `${(row.value / scale) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease }}
              />
            </div>
          </div>
        ))}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-6 border-l border-dashed border-foreground/40"
          style={{ left: `${(safeLimit / scale) * 100}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {exceeds
          ? `The requested payment is ${formatINR(requested - safeLimit)} above the safe monthly limit.`
          : `The requested payment leaves ${formatINR(safeLimit - requested)} of headroom under the safe limit.`}
      </p>
    </section>
  );
}
