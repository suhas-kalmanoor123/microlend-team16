"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { LenderMatch, LenderProfile } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/progress-bar";
import { formatINR, formatTenure, riskPreferenceLabel } from "@/components/shared/format";

type LenderCardProps = {
  lender: LenderProfile;
  match: LenderMatch;
  index: number;
  isTop: boolean;
  accepting: boolean;
  disabled: boolean;
  onAccept: () => void;
};

export function LenderCard({ lender, match, index, isTop, accepting, disabled, onAccept }: LenderCardProps) {
  const subScores = [
    { label: "Amount fit", value: match.amountFit },
    { label: "Tenure fit", value: match.tenureFit },
    { label: "Risk fit", value: match.riskFit },
  ];
  const terms = [
    { label: "Loan range", value: `${formatINR(lender.minLoanAmount)} – ${formatINR(lender.maxLoanAmount)}` },
    { label: "Preferred tenure", value: formatTenure(lender.preferredTenureMonths) },
    { label: "Risk appetite", value: riskPreferenceLabel[lender.riskPreference].replace(" risk appetite", "") },
    { label: "Available capital", value: formatINR(lender.availableCapital) },
  ];
  const scoreTone =
    match.matchScore >= 80 ? "text-foreground" : match.matchScore >= 60 ? "text-foreground/80" : "text-muted-foreground";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby={`lender-${lender.id}`}
      className={cn(
        "flex flex-col gap-5 rounded-xl border bg-card p-5 sm:p-6",
        isTop && "border-primary/40 shadow-card",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h2 id={`lender-${lender.id}`} className="text-base font-semibold tracking-tight text-foreground">
              {lender.name}
            </h2>
            {isTop ? (
              <span className="rounded-full border border-primary/25 bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
                Best match
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">{riskPreferenceLabel[lender.riskPreference]}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Smart Match</span>
          <span className={cn("font-mono text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl", scoreTone)}>
            {match.matchScore}%
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {subScores.map((score, i) => (
          <div key={score.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">{score.label}</span>
              <span className="font-mono tabular-nums text-foreground">{score.value}</span>
            </div>
            <ProgressBar
              value={score.value}
              label={`${score.label} for ${lender.name}`}
              delay={0.15 + 0.08 * index + i * 0.05}
              barClassName={isTop ? "bg-primary" : "bg-border-strong"}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-end sm:justify-between">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {terms.map((term) => (
            <div key={term.label} className="flex flex-col gap-0.5">
              <dt className="text-[11px] text-muted-foreground">{term.label}</dt>
              <dd className="font-mono text-xs tabular-nums text-foreground">{term.value}</dd>
            </div>
          ))}
        </dl>
        <Button
          variant={isTop ? "default" : "outline"}
          onClick={onAccept}
          disabled={disabled}
          className="shrink-0"
          aria-label={`Accept loan from ${lender.name}`}
        >
          {accepting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {accepting ? "Accepting…" : "Accept loan"}
        </Button>
      </div>
    </motion.article>
  );
}
