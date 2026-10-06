"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { FactorImpact } from "@/lib/types";
import { cn } from "@/components/ui/cn";

export function FactorsList({ factors }: { factors: FactorImpact[] }) {
  return (
    <section aria-labelledby="factors-heading" className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="factors-heading" className="text-sm font-medium text-foreground">
          What shaped this assessment
        </h2>
        <p className="text-xs text-muted-foreground">
          This is a transparent rule-based score, not a trained ML model.
        </p>
      </div>
      <ul className="flex flex-col divide-y">
        {factors.map((factor, index) => (
          <motion.li
            key={factor.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.35 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md border",
                factor.positive
                  ? "border-success/25 bg-success-soft text-success"
                  : "border-warning/25 bg-warning-soft text-warning",
              )}
            >
              {factor.positive ? (
                <Plus className="size-3.5" aria-hidden="true" />
              ) : (
                <Minus className="size-3.5" aria-hidden="true" />
              )}
              <span className="sr-only">{factor.positive ? "Positive factor:" : "Negative factor:"}</span>
            </span>
            <span className="text-sm text-foreground">{factor.label}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
