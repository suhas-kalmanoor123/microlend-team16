import type { Metadata } from "next";
import { Landmark, UserRound } from "lucide-react";
import { AppNav } from "@/components/shared/app-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { RoleCard } from "@/components/shared/role-card";

export const metadata: Metadata = {
  title: "Choose your role — MicroLend",
  description: "Continue to the MicroLend demo as a borrower or a lender.",
};

export default function LoginPage() {
  return (
    <>
      <AppNav backHref="/" backLabel="Home" />
      <PageTransition>
        <PageHeader
          eyebrow="Demo"
          title="Choose your role"
          description="Explore MicroLend from either side of the loan. No account needed — the demo uses sample profiles."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard
            href="/borrower"
            icon={UserRound}
            title="Borrower"
            description="Request a small loan and see an explainable assessment before you commit."
            points={["Transparent risk score", "Safer amount suggestions", "Smart lender matching"]}
          />
          <RoleCard
            href="/lender"
            icon={Landmark}
            title="Lender"
            description="Review vetted borrower requests that match your capital and risk appetite."
            points={["Matched requests only", "Clear risk factors", "On-chain loan records"]}
          />
        </div>
      </PageTransition>
    </>
  );
}
