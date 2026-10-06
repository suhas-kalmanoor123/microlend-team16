import type { Metadata } from "next";
import { AppNav } from "@/components/shared/app-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { BorrowerSetup } from "@/components/borrower/borrower-setup";

export const metadata: Metadata = {
  title: "Request a loan — MicroLend",
  description: "Pick a borrower scenario and run an explainable loan assessment.",
};

export default function BorrowerPage() {
  return (
    <>
      <AppNav backHref="/login" backLabel="Choose role" />
      <PageTransition>
        <PageHeader
          eyebrow="Borrower · Step 1 of 3"
          title="Request a loan"
          description="Pick a sample borrower, set the amount and tenure, and we will check whether the repayment fits their cash flow."
        />
        <BorrowerSetup />
      </PageTransition>
    </>
  );
}
