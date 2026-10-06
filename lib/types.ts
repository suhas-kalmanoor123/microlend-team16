// Shared data shapes. Do not edit without telling the team.

export type BorrowerProfile = {
  id: string;
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingObligations: number;
  previousLoans: number;
  successfullyRepaid: number;
  missedPayments: number;
  incomeStability: "STABLE" | "MODERATE" | "IRREGULAR";
};

export type LenderProfile = {
  id: string;
  name: string;
  availableCapital: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  riskPreference: "LOW" | "MEDIUM" | "HIGH";
  preferredTenureMonths: number;
};

export type LoanRequest = {
  amount: number;
  tenureMonths: number;
};

export type FactorImpact = {
  label: string;
  positive: boolean;
};

export type FeasibilityResult = {
  verdict: "RECOMMENDED" | "NOT_RECOMMENDED";
  riskScore: number; // 0 to 100, higher = riskier
  riskLevel: "LOW" | "LOW_MEDIUM" | "MEDIUM" | "HIGH";
  monthlyRepaymentCapacity: number;
  recommendedAmount: number;
  recommendedTenureMonths: number;
  recommendedMonthlyPayment: number;
  factors: FactorImpact[];
};

export type LenderMatch = {
  lenderId: string;
  matchScore: number; // 0 to 100
  amountFit: number;
  tenureFit: number;
  riskFit: number;
};

export type Loan = {
  id: string;
  borrowerId: string;
  lenderId: string;
  principal: number;
  tenureMonths: number;
  monthlyRepayment: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED";
  repaymentsMade: number;
  contractAddress?: string;
  transactionHash?: string;
};