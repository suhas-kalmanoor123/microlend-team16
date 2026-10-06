   import type { Loan } from "@/lib/types";

   export const mockLoans: Loan[] = [
     {
       id: "loan-1",
       borrowerId: "borrower-1",
       lenderId: "lender-1",
       principal: 12000,
       tenureMonths: 3,
       monthlyRepayment: 4000,
       status: "PENDING",
       repaymentsMade: 0,
     },
     {
       id: "loan-2",
       borrowerId: "borrower-3",
       lenderId: "lender-2",
       principal: 18000,
       tenureMonths: 3,
       monthlyRepayment: 6000,
       status: "ACTIVE",
       repaymentsMade: 1,
     },
     {
       id: "loan-3",
       borrowerId: "borrower-1",
       lenderId: "lender-1",
       principal: 8000,
       tenureMonths: 4,
       monthlyRepayment: 2000,
       status: "COMPLETED",
       repaymentsMade: 4,
     },
   ];