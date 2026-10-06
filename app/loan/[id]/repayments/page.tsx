import type { Metadata } from "next";
import { AppNav } from "@/components/shared/app-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { RepaymentsView } from "@/components/loan/repayments-view";

export const metadata: Metadata = {
  title: "Repayments — MicroLend",
  description: "Repayment progress and verified history.",
};

export default function RepaymentsPage() {
  return (
    <>
      <AppNav backHref="/borrower/matches" backLabel="Matches" />
      <PageTransition>
        <RepaymentsView />
      </PageTransition>
    </>
  );
}