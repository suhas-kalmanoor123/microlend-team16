   import type { LenderProfile } from "@/lib/types";

   export const mockLenders: LenderProfile[] = [
     {
       id: "lender-1",
       name: "Meera Iyer",
       availableCapital: 60000,
       minLoanAmount: 5000,
       maxLoanAmount: 25000,
       riskPreference: "LOW",
       preferredTenureMonths: 3,
     },
     {
       id: "lender-2",
       name: "Vikram Singh",
       availableCapital: 40000,
       minLoanAmount: 10000,
       maxLoanAmount: 50000,
       riskPreference: "MEDIUM",
       preferredTenureMonths: 6,
     },
     {
       id: "lender-3",
       name: "Anita Desai",
       availableCapital: 100000,
       minLoanAmount: 2000,
       maxLoanAmount: 15000,
       riskPreference: "HIGH",
       preferredTenureMonths: 2,
     },
     {
       id: "lender-4",
       name: "Kabir Shah",
       availableCapital: 8000,
       minLoanAmount: 3000,
       maxLoanAmount: 10000,
       riskPreference: "MEDIUM",
       preferredTenureMonths: 4,
     },
   ];