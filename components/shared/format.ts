import type { BorrowerProfile, FeasibilityResult, LenderProfile } from "@/lib/types";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(value: number) {
  return inrFormatter.format(value);
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatTenure(months: number) {
  return `${months} month${months === 1 ? "" : "s"}`;
}

export const riskLevelLabel: Record<FeasibilityResult["riskLevel"], string> = {
  LOW: "Low risk",
  LOW_MEDIUM: "Low–medium risk",
  MEDIUM: "Medium risk",
  HIGH: "High risk",
};

export const riskPreferenceLabel: Record<LenderProfile["riskPreference"], string> = {
  LOW: "Low risk appetite",
  MEDIUM: "Medium risk appetite",
  HIGH: "High risk appetite",
};

const stabilityLabel: Record<BorrowerProfile["incomeStability"], string> = {
  STABLE: "Stable income",
  MODERATE: "Moderate income stability",
  IRREGULAR: "Irregular income",
};

export function borrowerSummary(borrower: BorrowerProfile) {
  const history =
    borrower.previousLoans === 0
      ? "no previous loans"
      : borrower.missedPayments > 0
        ? `${borrower.missedPayments} missed repayment${borrower.missedPayments > 1 ? "s" : ""}`
        : `${borrower.successfullyRepaid} of ${borrower.previousLoans} loans repaid`;
  return `${stabilityLabel[borrower.incomeStability]} · ${formatINR(borrower.monthlyIncome)}/mo · ${history}`;
}
