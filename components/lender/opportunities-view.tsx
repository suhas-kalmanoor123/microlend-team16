"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAppState } from "@/components/app-state";
import {
  calculateLenderMatches,
  calculateLoanFeasibility,
  mockBorrowers,
  mockLenders,
} from "@/lib/demo/api";
import { formatINR } from "@/lib/demo/format";
import type { BorrowerProfile, FeasibilityResult, LenderMatch, LoanRequest } from "@/lib/types";

// Standard demo request every borrower is assessed against.
const DEMO_REQUEST: LoanRequest = { amount: 30000, tenureMonths: 3 };

type Row = {
  borrower: BorrowerProfile;
  result: FeasibilityResult;
  match: LenderMatch | null;
};

const wrap = "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6";

// Accepts either a 0-100 or a 0-1 scale and returns a clamped 0-100 number.
const pct = (value: number | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  const scaled = value > 1 ? value : value * 100;
  return Math.max(0, Math.min(100, Math.round(scaled)));
};

const riskText: Record<string, string> = {
  LOW: "Low risk",
  LOW_MEDIUM: "Low to medium risk",
  MEDIUM: "Medium risk",
  HIGH: "High risk",
};

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
        <motion.div
          className="h-full rounded-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function OpportunitiesView() {
  const router = useRouter();
  const params = useSearchParams();
  const { setBorrower, setAssessment, setAcceptedLoan } = useAppState();

  const lender = mockLenders.find((l) => l.id === params.get("lender")) ?? mockLenders[0];

  const rows = useMemo<Row[]>(() => {
    if (!lender) return [];
    return mockBorrowers
      .map((borrower) => {
        const result = calculateLoanFeasibility(borrower, DEMO_REQUEST);
        const match = calculateLenderMatches(borrower, result, [lender])[0] ?? null;
        return { borrower, result, match };
      })
      .sort((a, b) => pct(b.match?.matchScore) - pct(a.match?.matchScore));
  }, [lender]);

  if (!lender) {
    return <div className={wrap + " text-sm text-muted-foreground"}>No lender profiles available.</div>;
  }

  const accept = (row: Row) => {
    setBorrower(row.borrower);
    setAssessment(DEMO_REQUEST, row.result);
    setAcceptedLoan({
      id: "LN-1024",
      borrowerId: row.borrower.id,
      lenderId: lender.id,
      principal: row.result.recommendedAmount,
      tenureMonths: row.result.recommendedTenureMonths,
      monthlyRepayment: row.result.recommendedMonthlyPayment,
      status: "PENDING",
      repaymentsMade: 0,
    });
    router.push("/loan/LN-1024");
  };

  return (
    <div className={wrap + " space-y-6"}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Opportunities</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Borrowers assessed for {lender.name} ({formatINR(lender.minLoanAmount)} to{" "}
          {formatINR(lender.maxLoanAmount)}). Each borrower requested {formatINR(DEMO_REQUEST.amount)} over{" "}
          {DEMO_REQUEST.tenureMonths} months. Amounts below are the safer recommendation.
        </p>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => {
          const { borrower, result, match } = row;
          const canAccept = result.recommendedAmount > 0;
          return (
            <motion.div
              key={borrower.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">{borrower.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {riskText[result.riskLevel] ?? result.riskLevel} · risk score {result.riskScore}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Smart Match</p>
                  <p className="text-2xl font-semibold text-foreground">{pct(match?.matchScore)}%</p>
                </div>
              </div>

              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Recommended amount</dt>
                  <dd className="mt-1 font-medium text-foreground">{formatINR(result.recommendedAmount)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tenure</dt>
                  <dd className="mt-1 font-medium text-foreground">{result.recommendedTenureMonths} months</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Monthly payment</dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {formatINR(result.recommendedMonthlyPayment)}
                  </dd>
                </div>
              </dl>

              {match && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Bar label="Amount fit" value={pct(match.amountFit)} />
                  <Bar label="Tenure fit" value={pct(match.tenureFit)} />
                  <Bar label="Risk fit" value={pct(match.riskFit)} />
                </div>
              )}

              <ul className="mt-4 space-y-1 text-sm">
                {result.factors.slice(0, 3).map((factor) => (
                  <li key={factor.label} className="flex gap-2 text-muted-foreground">
                    <span className={factor.positive ? "text-emerald-500" : "text-amber-500"}>
                      {factor.positive ? "+" : "−"}
                    </span>
                    {factor.label}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => accept(row)}
                disabled={!canAccept}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canAccept ? "Accept borrower" : "No safe amount"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}