"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList } from "lucide-react";
import { calculateLenderMatches, mockLenders } from "@/lib/demo/api";
import { useAppState } from "@/components/app-state";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { VerdictCard } from "@/components/borrower/verdict-card";
import { RequestComparison } from "@/components/borrower/request-comparison";
import { CapacityBar } from "@/components/borrower/capacity-bar";
import { FactorsList } from "@/components/borrower/factors-list";

export function AssessmentView() {
  const router = useRouter();
  const { hydrated, borrower, loanRequest, feasibility, setMatches } = useAppState();

  if (!hydrated) return <LoadingState label="Loading assessment" />;

  if (!borrower || !loanRequest || !feasibility) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No assessment yet"
        description="Pick a borrower scenario and run an assessment to see the verdict and the factors behind it."
        actionHref="/borrower"
        actionLabel="Start an assessment"
      />
    );
  }

  const firstName = borrower.name.split(" ")[0];

  function findLenders() {
    if (!borrower || !feasibility) return;
    setMatches(calculateLenderMatches(borrower, feasibility, mockLenders));
    router.push("/borrower/matches");
  }

  return (
    <>
      <PageHeader
        eyebrow="Borrower · Step 2 of 3"
        title={`Assessment for ${borrower.name}`}
        description="A plain-language view of whether this loan fits, and what would fit better."
      />
      <div className="flex flex-col gap-4">
        <VerdictCard result={feasibility} borrowerName={firstName} />
        <RequestComparison request={loanRequest} result={feasibility} />
        <div className="grid gap-4 lg:grid-cols-2">
          <CapacityBar request={loanRequest} result={feasibility} />
          <FactorsList factors={feasibility.factors} />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => router.push("/borrower")}>
          Adjust request
        </Button>
        <Button size="lg" className="group" onClick={findLenders}>
          Find matching lenders
          <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </>
  );
}
