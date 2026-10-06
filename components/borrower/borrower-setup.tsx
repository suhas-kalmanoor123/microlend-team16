"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { calculateLoanFeasibility, mockBorrowers } from "@/lib/demo/api";
import type { BorrowerProfile } from "@/lib/types";
import { useAppState } from "@/components/app-state";
import { Button } from "@/components/ui/button";
import { ScenarioPicker } from "@/components/borrower/scenario-picker";
import { BorrowerSummary } from "@/components/borrower/borrower-summary";
import { MAX_AMOUNT, MIN_AMOUNT, RequestPanel } from "@/components/borrower/request-panel";
import { ANALYSIS_STEPS, AnalyzingState } from "@/components/borrower/analyzing-state";

const STEP_MS = 500;

export function BorrowerSetup() {
  const router = useRouter();
  const { borrower: storedBorrower, loanRequest, setBorrower, setAssessment } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [tenure, setTenure] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const borrower =
    mockBorrowers.find((b) => b.id === (selectedId ?? storedBorrower?.id)) ?? mockBorrowers[0];
  const currentAmount = amount ?? loanRequest?.amount ?? 30000;
  const currentTenure = tenure ?? loanRequest?.tenureMonths ?? 3;
  const analyzing = activeStep !== null;
  const invalid = currentAmount < MIN_AMOUNT || currentAmount > MAX_AMOUNT;

  function handleSelect(next: BorrowerProfile) {
    setSelectedId(next.id);
  }

  function runAssessment() {
    if (invalid || analyzing) return;
    const request = { amount: currentAmount, tenureMonths: currentTenure };
    const result = calculateLoanFeasibility(borrower, request);
    setActiveStep(0);
    ANALYSIS_STEPS.forEach((_, index) => {
      if (index === 0) return;
      timers.current.push(window.setTimeout(() => setActiveStep(index), STEP_MS * index));
    });
    timers.current.push(
      window.setTimeout(() => {
        setActiveStep(ANALYSIS_STEPS.length);
        setBorrower(borrower);
        setAssessment(request, result);
        router.push("/borrower/assessment");
      }, STEP_MS * ANALYSIS_STEPS.length),
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
      <ScenarioPicker borrowers={mockBorrowers} selectedId={borrower.id} onSelect={handleSelect} />

      <section
        aria-labelledby="request-heading"
        className="flex flex-col gap-5 self-start rounded-xl border bg-card p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-col gap-3">
          <h2 id="request-heading" className="text-sm font-medium text-foreground">
            Loan request for {borrower.name}
          </h2>
          <BorrowerSummary borrower={borrower} />
        </div>

        <div className="border-t pt-5">
          <AnimatePresence mode="wait" initial={false}>
            {analyzing ? (
              <AnalyzingState key="analyzing" activeStep={activeStep} name={borrower.name.split(" ")[0]} />
            ) : (
              <RequestPanel
                key="form"
                amount={currentAmount}
                tenure={currentTenure}
                onAmountChange={setAmount}
                onTenureChange={setTenure}
              />
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={runAssessment}
          disabled={invalid || analyzing}
          className="group w-full"
        >
          {analyzing ? "Analyzing…" : "Run assessment"}
          {analyzing ? null : (
            <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
          )}
        </Button>
      </section>
    </div>
  );
}
