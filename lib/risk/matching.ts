   import type {
     BorrowerProfile,
     FeasibilityResult,
     LenderMatch,
     LenderProfile,
   } from "@/lib/types";

   // Tunable rules: how much risk each lender type is comfortable with (0 to 100 score).
   const RISK_COMFORT = { LOW: 25, MEDIUM: 50, HIGH: 80 };
   // How much each check counts towards the final match score.
   const WEIGHTS = { amount: 0.4, tenure: 0.2, risk: 0.4 };

   const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

   export function calculateLenderMatches(
     _borrower: BorrowerProfile,
     result: FeasibilityResult,
     lenders: LenderProfile[]
   ): LenderMatch[] {
     const amount = result.recommendedAmount;
     const tenure = result.recommendedTenureMonths;

     const matches = lenders.map((lender): LenderMatch => {
       // 1. Amount: does the lender have the money, and is the size in their range?
       let amountFit = 100;
       if (amount > lender.availableCapital) {
         amountFit = 0;
       } else if (amount < lender.minLoanAmount) {
         amountFit = lender.minLoanAmount > 0 ? (amount / lender.minLoanAmount) * 100 : 100;
       } else if (amount > lender.maxLoanAmount) {
         amountFit = (lender.maxLoanAmount / amount) * 100;
       }

       // 2. Tenure: lose 20 points for every month away from the lender's preference.
       const tenureFit = 100 - 20 * Math.abs(lender.preferredTenureMonths - tenure);

       // 3. Risk: full marks if within the lender's comfort level, then falls off.
       const comfort = RISK_COMFORT[lender.riskPreference];
       const riskFit =
         result.riskScore <= comfort ? 100 : 100 - (result.riskScore - comfort) * 2.5;

       const matchScore =
         clamp(amountFit) * WEIGHTS.amount +
         clamp(tenureFit) * WEIGHTS.tenure +
         clamp(riskFit) * WEIGHTS.risk;

       return {
         lenderId: lender.id,
         matchScore: clamp(matchScore),
         amountFit: clamp(amountFit),
         tenureFit: clamp(tenureFit),
         riskFit: clamp(riskFit),
       };
     });

     // Best match first
     return matches.sort((a, b) => b.matchScore - a.matchScore);
   }