import type { Metadata } from "next";
import { Suspense } from "react";
import { AppNav } from "@/components/shared/app-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { OpportunitiesView } from "@/components/lender/opportunities-view";

export const metadata: Metadata = {
  title: "Opportunities — MicroLend",
  description: "Borrowers that fit your lending terms.",
};

export default function OpportunitiesPage() {
  return (
    <>
      <AppNav backHref="/lender" backLabel="Lender" />
      <PageTransition>
        <Suspense fallback={null}>
          <OpportunitiesView />
        </Suspense>
      </PageTransition>
    </>
  );
}