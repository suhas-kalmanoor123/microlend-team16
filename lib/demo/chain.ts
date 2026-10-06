import type { Loan } from "@/lib/types";

// TEMPORARY STAND-INS, replaced by lib/blockchain/loan.ts later.
// Each function waits briefly and returns a fake transaction hash.

export const DEMO_MODE = true;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function randomHex(length: number): string {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * 16)];
  return out;
}

const fakeHash = () => "0x" + randomHex(64);
const FAKE_CONTRACT = "0x3A1f7C9b2E4d58A06b1C9eD2f47a0B5c8D1e6F92";

export async function createLoanOnChain(loan: Loan): Promise<{ txHash: string; contractAddress: string }> {
  void loan;
  await sleep(1500);
  return { txHash: fakeHash(), contractAddress: FAKE_CONTRACT };
}

export async function recordRepaymentOnChain(loanId: string): Promise<{ txHash: string }> {
  void loanId;
  await sleep(1500);
  return { txHash: fakeHash() };
}

export async function completeLoanOnChain(loanId: string): Promise<{ txHash: string }> {
  void loanId;
  await sleep(1500);
  return { txHash: fakeHash() };
}

export function explorerTxUrl(txHash: string): string {
  return "https://sepolia.etherscan.io/tx/" + txHash;
}