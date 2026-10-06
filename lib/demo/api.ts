// TEMPORARY STAND-INS, replaced by lib/risk and data/ later.
// Simple rule-based logic so the borrower screens can be built end to end.

import type {
  BorrowerProfile,
  FactorImpact,
  FeasibilityResult,
  LenderMatch,
  LenderProfile,
  LoanRequest,
} from "@/lib/types";

export const mockBorrowers: BorrowerProfile[] = [
  {
    id: "b-aarav",
    name: "Aarav Sharma",
    age: 21,
    monthlyIncome: 28000,
    monthlyExpenses: 17000,
    existingObligations: 3000,
    previousLoans: 2,
    successfullyRepaid: 2,
    missedPayments: 0,
    incomeStability: "STABLE",
  },
  {
    id: "b-priya",
    name: "Priya Nair",
    age: 23,
    monthlyIncome: 24000,
    monthlyExpenses: 14000,
    existingObligations: 2000,
    previousLoans: 1,
    successfullyRepaid: 1,
    missedPayments: 0,
    incomeStability: "IRREGULAR",
  },
  {
    id: "b-rohan",
    name: "Rohan Verma",
    age: 25,
    monthlyIncome: 32000,
    monthlyExpenses: 20000,
    existingObligations: 6000,
    previousLoans: 3,
    successfullyRepaid: 2,
    missedPayments: 1,
    incomeStability: "MODERATE",
  },
  {
    id: "b-meera",
    name: "Meera Iyer",
    age: 27,
    monthlyIncome: 65000,
    monthlyExpenses: 30000,
    existingObligations: 5000,
    previousLoans: 4,
    successfullyRepaid: 4,
    missedPayments: 0,
    incomeStability: "STABLE",
  },
];

export const mockLenders: LenderProfile[] = [
  {
    id: "l-kavya",
    name: "Kavya Capital",
    availableCapital: 100000,
    minLoanAmount: 5000,
    maxLoanAmount: 20000,
    riskPreference: "MEDIUM",
    preferredTenureMonths: 3,
  },
  {
    id: "l-northstar",
    name: "Northstar Microfinance",
    availableCapital: 60000,
    minLoanAmount: 2000,
    maxLoanAmount: 15000,
    riskPreference: "LOW",
    preferredTenureMonths: 2,
  },
  {
    id: "l-sahayog",
    name: "Sahayog Collective",
    availableCapital: 250000,
    minLoanAmount: 2000,
    maxLoanAmount: 50000,
    riskPreference: "HIGH",
    preferredTenureMonths: 6,
  },
  {
    id: "l-meridian",
    name: "Meridian Lending",
    availableCapital: 500000,
    minLoanAmount: 25000,
    maxLoanAmount: 100000,
    riskPreference: "MEDIUM",
    preferredTenureMonths: 6,
  },
];

const SAFE_PAYMENT_SHARE = 0.5;

function riskLevelFromScore(score: number): FeasibilityResult["riskLevel"] {
  if (score < 25) return "LOW";
  if (score < 45) return "LOW_MEDIUM";
  if (score < 65) return "MEDIUM";
  return "HIGH";
}

export function calculateLoanFeasibility(
  profile: BorrowerProfile,
  request: LoanRequest,
): FeasibilityResult {
  const capacity = Math.max(
    0,
    profile.monthlyIncome - profile.monthlyExpenses - profile.existingObligations,
  );
  const safeMonthlyPayment = capacity * SAFE_PAYMENT_SHARE;
  const tenure = Math.max(1, request.tenureMonths);
  const requestedMonthly = request.amount / tenure;
  const exceedsCapacity = requestedMonthly > safeMonthlyPayment;

  const factors: FactorImpact[] = [];
  let score = 50;

  if (profile.incomeStability === "STABLE") {
    score -= 15;
    factors.push({ label: "Stable monthly income", positive: true });
  } else if (profile.incomeStability === "IRREGULAR") {
    score += 15;
    factors.push({ label: "Irregular income pattern", positive: false });
  }

  if (profile.missedPayments > 0) {
    score += 15 * profile.missedPayments;
    factors.push({
      label: `${profile.missedPayments} missed repayment${profile.missedPayments > 1 ? "s" : ""} on record`,
      positive: false,
    });
  } else if (profile.previousLoans > 0 && profile.successfullyRepaid === profile.previousLoans) {
    score -= 10;
    factors.push({ label: "Previous loans repaid on time", positive: true });
  } else if (profile.previousLoans === 0) {
    score += 5;
    factors.push({ label: "Limited borrowing history", positive: false });
  }

  const obligationRatio =
    profile.monthlyIncome > 0 ? profile.existingObligations / profile.monthlyIncome : 1;
  if (obligationRatio <= 0.15) {
    score -= 5;
    factors.push({ label: "Manageable existing obligations", positive: true });
  } else if (obligationRatio > 0.3) {
    score += 10;
    factors.push({ label: "High existing obligations", positive: false });
  }

  if (exceedsCapacity) {
    score += 15;
    factors.push({ label: "Requested amount exceeds repayment capacity", positive: false });
  } else {
    factors.push({ label: "Requested payment fits repayment capacity", positive: true });
  }

  const riskScore = Math.min(100, Math.max(0, score));
  const riskLevel = riskLevelFromScore(riskScore);
  const verdict = exceedsCapacity || riskLevel === "HIGH" ? "NOT_RECOMMENDED" : "RECOMMENDED";

  const recommendedAmount = exceedsCapacity
    ? Math.floor((safeMonthlyPayment * tenure) / 500) * 500
    : request.amount;

  return {
    verdict,
    riskScore,
    riskLevel,
    monthlyRepaymentCapacity: capacity,
    recommendedAmount,
    recommendedTenureMonths: tenure,
    recommendedMonthlyPayment: Math.round(recommendedAmount / tenure),
    factors,
  };
}

const riskRank: Record<FeasibilityResult["riskLevel"], number> = {
  LOW: 1,
  LOW_MEDIUM: 2,
  MEDIUM: 3,
  HIGH: 4,
};

const toleranceRank: Record<LenderProfile["riskPreference"], number> = {
  LOW: 1,
  MEDIUM: 3,
  HIGH: 4,
};

function clampScore(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)));
}

export function calculateLenderMatches(
  borrower: BorrowerProfile,
  result: FeasibilityResult,
  lenders: LenderProfile[],
): LenderMatch[] {
  void borrower;
  const amount = result.recommendedAmount;
  const tenure = result.recommendedTenureMonths;
  const borrowerRisk = riskRank[result.riskLevel];

  return lenders
    .map((lender) => {
      let amountFit: number;
      if (amount > lender.availableCapital) {
        amountFit = 0;
      } else if (amount < lender.minLoanAmount) {
        amountFit = 100 - ((lender.minLoanAmount - amount) / lender.minLoanAmount) * 100;
      } else if (amount > lender.maxLoanAmount) {
        amountFit = 100 - ((amount - lender.maxLoanAmount) / lender.maxLoanAmount) * 100;
      } else {
        amountFit = 100;
      }

      const tenureFit = 100 - 25 * Math.abs(tenure - lender.preferredTenureMonths);

      const tolerance = toleranceRank[lender.riskPreference];
      const riskFit =
        borrowerRisk <= tolerance
          ? 100 - 20 * (tolerance - borrowerRisk)
          : 100 - 40 * (borrowerRisk - tolerance);

      const a = clampScore(amountFit);
      const t = clampScore(tenureFit);
      const r = clampScore(riskFit);

      return {
        lenderId: lender.id,
        matchScore: clampScore(a * 0.4 + t * 0.3 + r * 0.3),
        amountFit: a,
        tenureFit: t,
        riskFit: r,
      };
    })
    .sort((x, y) => y.matchScore - x.matchScore);
}
