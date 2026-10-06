"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/components/ui/cn";

export const ANALYSIS_STEPS = ["Reading cash flow", "Estimating repayment capacity", "Scoring risk"];

export function AnalyzingState({ activeStep, name }: { activeStep: number; name: string }) {
  const progress = Math.min(100, ((activeStep + 1) / ANALYSIS_STEPS.length) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="status"
      aria-live="polite"
      className="flex flex-col gap-6 py-2"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">Analyzing {name}&apos;s profile</p>
        <p className="text-xs text-muted-foreground">Running the transparent rule-based assessment.</p>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
      <ol className="flex flex-col gap-3">
        {ANALYSIS_STEPS.map((step, index) => {
          const done = index < activeStep;
          const active = index === activeStep;
          return (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border transition-colors",
                  done && "border-success/30 bg-success-soft text-success",
                  active && "border-primary/30 bg-primary-soft text-primary",
                )}
                aria-hidden="true"
              >
                {done ? (
                  <Check className="size-3" />
                ) : active ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <span className="size-1 rounded-full bg-border-strong" />
                )}
              </span>
              <span className={cn(done || active ? "text-foreground" : "text-muted-foreground")}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}
