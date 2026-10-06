"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { mockLenders } from "@/lib/demo/api";
import type { Loan } from "@/lib/types";
import { useAppState } from "@/components/app-state";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { formatINR, formatTenure } from "@/components/shared/format";
import { LenderCard } from "@/components/borrower/lender-card";

const LOAN_ID = "LN-1024";

export function MatchesView() {
  const router = useRouter();
  const { hydrated, borrower, feasibility, matches, setAcceptedLoan } = useAppState();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  if (!hydrated) return <LoadingState label="Loading lender matches" />;

  if (!borrower || !feasibility || !matches) {
    return (
      <EmptyState
        icon={Users}
        title="No lender matches yet"
        description="Run an assessment first, then we will rank lenders by how well their terms fit."
        actionHref="/borrower"
        actionLabel="Start an assessment"
      />
    );
  }

  const rows = matches
    .map((match) => ({ match, lender: mockLenders.find((l) => l.id === match.lenderId) }))
    .filter((row): row is { match: typeof row.match; lender: NonNullable<typeof row.lender> } => Boolean(row.lender));

  function accept(lenderId: string) {
    if (!borrower || !feasibility) return;
    setAcceptingId(lenderId);
    const loan: Loan = {
      id: LOAN_ID,
      borrowerId: borrower.id,
      lenderId,
      principal: feasibility.recommendedAmount,
      tenureMonths: feasibility.recommendedTenureMonths,
      monthlyRepayment: feasibility.recommendedMonthlyPayment,
      status: "PENDING",
      repaymentsMade: 0,
    };
    setAcceptedLoan(loan);
    router.push(`/loan/${LOAN_ID}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Borrower · Step 3 of 3"
        title="Matching lenders"
        description={
          <>
            Ranked for a loan of{" "}
            <span className="font-mono text-foreground">{formatINR(feasibility.recommendedAmount)}</span> over{" "}
            {formatTenure(feasibility.recommendedTenureMonths)} at{" "}
            <span className="font-mono text-foreground">{formatINR(feasibility.recommendedMonthlyPayment)}</span>
            /month.
          </>
        }
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No lenders available"
          description="None of the current lenders can fund this request. Try a smaller amount."
          actionHref="/borrower"
          actionLabel="Adjust request"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map(({ match, lender }, index) => (
            <LenderCard
              key={lender.id}
              lender={lender}
              match={match}
              index={index}
              isTop={index === 0}
              accepting={acceptingId === lender.id}
              disabled={acceptingId !== null || feasibility.recommendedAmount <= 0}
              onAccept={() => accept(lender.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
