   # MicroLend

   A micro-lending web app where small loans are matched to lenders and recorded on a public test blockchain, so every agreement and repayment can be verified by anyone. Built for the FinTech hackathon run by our college's Blockchain Club.

   **No real money moves.** Everything runs on the Base Sepolia test network.

   ## What it does

   1. A borrower requests a small loan.
   2. A transparent scoring engine checks affordability and recommends a safer amount if the request is too high.
   3. Lenders are ranked by how well they fit the loan.
   4. The agreed loan and each repayment are recorded on-chain.

   ## Why blockchain?

   A normal database is controlled by whoever runs it, and records can be changed quietly. Writing loan agreements and repayments on a public blockchain gives borrowers and lenders a shared record that neither side (nor us) can edit afterwards. Anyone can check it on a block explorer.

   ## On-chain vs off-chain

   | On-chain (public, permanent) | Off-chain (private, stays in the app) |
   | --- | --- |
   | Loan ID, principal, tenure, status [TODO: confirm with Nikhil] | Income, expenses and obligations |
   | Repayments made (count) | Borrower risk score and reasons |
   | Loan completion | Names and personal details |

   Private financial data never goes on the blockchain.

   ## Architecture

```
   Borrower / Lender (browser)
           |
      Next.js app  (screens)
        |        |
        |        +--> Risk engine (lib/risk): scoring + lender matching
        |
        +--> Blockchain layer (lib/blockchain): thirdweb
                    |
            Solidity contract on Base Sepolia
```

   ## How the risk score works (no machine learning)

   Every step is a simple, visible calculation:

   - Repayment capacity = income - expenses - existing obligations
   - Safe monthly payment = 50% of capacity
   - A loan is recommended only if its monthly payment is within the safe payment. Otherwise we recommend a smaller amount, rounded down to the nearest 500.
   - Risk score (0 to 100, higher = riskier) adds points for payment burden, unstable income, missed payments, no loan history and existing obligations. Under 20 is Low, 20 to 39 Low-Medium, 40 to 59 Medium, 60 and above High.
   - Each result comes with plain-language reasons.
   - Lender match score = 40% amount fit + 20% tenure fit + 40% risk fit.

   Example: Aarav asks for 30,000 over 3 months, which is 10,000 a month against a safe limit of 4,000. The app says NOT_RECOMMENDED and suggests 12,000 over 3 months.

   ## Tech stack

   Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, thirdweb, Solidity, Vercel.

   ## Setup

   You need [Node.js](https://nodejs.org) 20 or newer and Git.

```
   git clone https://github.com/suhas-kalmanoor123/microlend-team16.git
   cd microlend-team16
   npm install
   npm run dev
```

   Then open http://localhost:3000.

   ## Environment variables

   Create a file named `.env.local` in the project root. Never commit it, and never put a real wallet key in it. Use a fresh burner wallet on the test network only.

   | Name | What it is |
   | --- | --- |
   | `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | thirdweb client ID [TODO: confirm name with Nikhil] |
   | `NEXT_PUBLIC_DEMO_MODE` | `true` returns clearly fake transaction hashes so the demo never breaks without a wallet [TODO: confirm name with Nikhil] |

   ## How to test

   - Start the app with `npm run dev`.
   - Choose borrower Aarav Sharma and request 30,000 over 3 months. Expected: NOT_RECOMMENDED, recommending 12,000 over 3 months.
   - Type check: `npx tsc --noEmit` (no output means no errors).
   - Lint: `npm run lint`.

   ## Deployed contract

   - Network: Base Sepolia (test network)
   - Contract address: `[TODO: paste after deployment]`
   - Explorer link: `[TODO: paste Basescan link after deployment]`

   ## Team

   - Suhas: UI and integration
   - Nikhil: blockchain (smart contract and thirdweb)
   - Pranay: risk engine (scoring and lender matching)