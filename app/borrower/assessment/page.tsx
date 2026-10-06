import type { Metadata } from "next";
import { AppNav } from "@/components/shared/app-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { AssessmentView } from "@/components/borrower/assessment-view";

export const metadata: Metadata = {
  title: "Loan assessment — MicroLend",
  description: "An explainable, rule-based loan feasibility assessment.",
};

export default function AssessmentPage() {
  return (
    <>
      <AppNav backHref="/borrower" backLabel="Edit request" />
      <PageTransition>
        <AssessmentView />
      </PageTransition>
    </>
  );
}
