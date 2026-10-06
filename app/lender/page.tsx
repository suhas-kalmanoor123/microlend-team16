import type { Metadata } from "next";
import { AppNav } from "@/components/shared/app-nav";
import { PageTransition } from "@/components/shared/page-transition";
import { LenderView } from "@/components/lender/lender-view";

export const metadata: Metadata = {
  title: "Lender — MicroLend",
  description: "Choose a lender profile and review lending terms.",
};

export default function LenderPage() {
  return (
    <>
      <AppNav backHref="/login" backLabel="Role" />
      <PageTransition>
        <LenderView />
      </PageTransition>
    </>
  );
}