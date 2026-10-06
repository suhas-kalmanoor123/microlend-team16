"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { BorrowerProfile } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { borrowerSummary } from "@/components/shared/format";

type ScenarioPickerProps = {
  borrowers: BorrowerProfile[];
  selectedId: string;
  onSelect: (borrower: BorrowerProfile) => void;
};

export function ScenarioPicker({ borrowers, selectedId, onSelect }: ScenarioPickerProps) {
  return (
    <section aria-labelledby="scenario-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 id="scenario-heading" className="text-sm font-medium text-foreground">
          Borrower scenario
        </h2>
        <span className="text-xs text-muted-foreground">{borrowers.length} sample profiles</span>
      </div>
      <div role="radiogroup" aria-labelledby="scenario-heading" className="flex flex-col gap-2">
        {borrowers.map((borrower, index) => {
          const selected = borrower.id === selectedId;
          const initials = borrower.name
            .split(" ")
            .map((part) => part[0])
            .join("");
          return (
            <motion.button
              key={borrower.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(borrower)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected ? "border-primary bg-primary-soft" : "hover:border-border-strong hover:bg-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-medium",
                  selected ? "border-primary/30 bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {initials}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">
                  {borrower.name}
                  <span className="ml-2 font-normal text-muted-foreground">{borrower.age}</span>
                </span>
                <span className="truncate text-xs text-muted-foreground">{borrowerSummary(borrower)}</span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
                )}
              >
                {selected ? <Check className="size-3" /> : null}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
