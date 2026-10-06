import type { Metadata } from "next";
import { AppNav } from "@/components/shared/app-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { LoanView } from "@/components/loan/loan-view";

export const metadata: Metadata = {
  title: "Loan — MicroLend",
  description: "Loan details and blockchain agreement.",
};

export default function LoanPage() {
  return (
    <>
      <AppNav backHref="/borrower/matches" backLabel="Matches" />
      <PageTransition>
        <LoanView />
      </PageTransition>
    </>
  );
}