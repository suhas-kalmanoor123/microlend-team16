   import type {
     BorrowerProfile,
     FactorImpact,
     FeasibilityResult,
     LoanRequest,
   } from "@/lib/types";

   // Tunable rules: change these numbers to make the engine stricter or looser.
   const SAFE_SHARE_OF_CAPACITY = 0.5; // only recommend using half of spare money
   const ROUND_DOWN_TO = 500; // recommended amounts round down to this step

   const money = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

   function riskLevelFor(score: number): FeasibilityResult["riskLevel"] {
     if (score < 20) return "LOW";
     if (score < 40) return "LOW_MEDIUM";
     if (score < 60) return "MEDIUM";
     return "HIGH";
   }

   export function calculateLoanFeasibility(
     profile: BorrowerProfile,
     request: LoanRequest
   ): FeasibilityResult {
     const tenure = Math.max(1, request.tenureMonths);

     // 1. How much can this person repay each month?
     const capacity = Math.max(
       0,
       profile.monthlyIncome - profile.monthlyExpenses - profile.existingObligations
     );
     const safePayment = capacity * SAFE_SHARE_OF_CAPACITY;
     const requestedPayment = request.amount / tenure;

     // 2. Verdict and safer amount
     const affordable = capacity > 0 && requestedPayment <= safePayment;
     const recommendedAmount = affordable
       ? request.amount
       : Math.min(
           request.amount,
           Math.floor((safePayment * tenure) / ROUND_DOWN_TO) * ROUND_DOWN_TO
         );
     const recommendedMonthlyPayment = Math.round(recommendedAmount / tenure);

     // 3. Risk score: we score the loan we would actually recommend
     const burden = capacity > 0 ? recommendedMonthlyPayment / capacity : 1;
     const burdenPoints = Math.min(burden, 1) * 40;
     const stabilityPoints = { STABLE: 0, MODERATE: 10, IRREGULAR: 25 }[
       profile.incomeStability
     ];
     const missedPoints = Math.min(profile.missedPayments, 3) * 10;
     const noHistoryPoints = profile.previousLoans === 0 ? 10 : 0;
     const obligationShare =
       profile.monthlyIncome > 0 ? profile.existingObligations / profile.monthlyIncome : 1;
     const obligationPoints = Math.min(obligationShare * 20, 10);

     const riskScore = Math.min(
       100,
       Math.round(
         burdenPoints + stabilityPoints + missedPoints + noHistoryPoints + obligationPoints
       )
     );

     // 4. Plain-language reasons shown to the user
     const factors: FactorImpact[] = [
       {
         label: affordable
           ? `Requested payment of ${money(requestedPayment)}/month is within the safe limit of ${money(safePayment)}/month`
           : `Requested payment of ${money(requestedPayment)}/month is above the safe limit of ${money(safePayment)}/month`,
         positive: affordable,
       },
       {
         label: `Income is ${profile.incomeStability.toLowerCase()}`,
         positive: profile.incomeStability === "STABLE",
       },
       {
         label:
           profile.missedPayments === 0
             ? "No missed payments in past loans"
             : `${profile.missedPayments} missed payment(s) in past loans`,
         positive: profile.missedPayments === 0,
       },
       {
         label:
           profile.previousLoans === 0
             ? "No previous loan history"
             : `Repaid ${profile.successfullyRepaid} of ${profile.previousLoans} previous loans`,
         positive:
           profile.previousLoans > 0 &&
           profile.successfullyRepaid === profile.previousLoans,
       },
       {
         label: `Existing obligations are ${Math.round(obligationShare * 100)}% of income`,
         positive: obligationShare < 0.2,
       },
     ];

     return {
       verdict: affordable ? "RECOMMENDED" : "NOT_RECOMMENDED",
       riskScore,
       riskLevel: riskLevelFor(riskScore),
       monthlyRepaymentCapacity: capacity,
       recommendedAmount,
       recommendedTenureMonths: tenure,
       recommendedMonthlyPayment,
       factors,
     };
   }