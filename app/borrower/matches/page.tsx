import type { Metadata } from "next";
import { AppNav } from "@/components/shared/app-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { MatchesView } from "@/components/borrower/matches-view";

export const metadata: Metadata = {
  title: "Matching lenders — MicroLend",
  description: "Lenders ranked by how well their terms fit your loan.",
};

export default function MatchesPage() {
  return (
    <>
      <AppNav backHref="/borrower/assessment" backLabel="Assessment" />
      <PageTransition>
        <MatchesView />
      </PageTransition>
    </>
  );
}
