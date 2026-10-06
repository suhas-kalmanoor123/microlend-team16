import {
  createPublicClient,
  createWalletClient,
  custom,
  type Address,
  type Hex,
  type WalletClient,
} from "viem";
import { sepolia } from "viem/chains";
import type { Loan } from "@/lib/types";

// Real transactions on Ethereum Sepolia through the user's wallet (MetaMask).
// Falls back to simulated transactions (Demo Mode) when no wallet is installed
// or NEXT_PUBLIC_DEMO_MODE is "true", so the app never breaks.

type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

declare global {
  interface Window {
    ethereum?: Eip1193;
  }
}

export const NETWORK_NAME = "Ethereum Sepolia";

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  "0x503c51253592fe04601882a149de30a7fe9ae928") as Address;

// Fixed demo lender address recorded on-chain (no funds ever move).
const DEMO_LENDER = "0x1111111111111111111111111111111111111111" as Address;

export const DEMO_MODE: boolean =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  (typeof window !== "undefined" && !window.ethereum);

const abi = [
  {
    type: "function",
    name: "createLoan",
    stateMutability: "nonpayable",
    inputs: [
      { name: "loanId", type: "string" },
      { name: "borrower", type: "address" },
      { name: "lender", type: "address" },
      { name: "principal", type: "uint256" },
      { name: "tenureMonths", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "recordRepayment",
    stateMutability: "nonpayable",
    inputs: [{ name: "loanId", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "completeLoan",
    stateMutability: "nonpayable",
    inputs: [{ name: "loanId", type: "string" }],
    outputs: [],
  },
] as const;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function randomHex(length: number): string {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * 16)];
  return out;
}

const fakeHash = () => "0x" + randomHex(64);

function clients() {
  if (!window.ethereum) throw new Error("No wallet found. Install MetaMask.");
  const transport = custom(window.ethereum as unknown as Parameters<typeof custom>[0]);
  return {
    wallet: createWalletClient({ chain: sepolia, transport }),
    publicClient: createPublicClient({ chain: sepolia, transport }),
  };
}

async function ensureNetwork() {
  const { wallet } = clients();
  const id = await wallet.getChainId();
  if (id !== sepolia.id) await wallet.switchChain({ id: sepolia.id });
}

export async function connectWallet(): Promise<{ address: string }> {
  const { wallet } = clients();
  const [address] = await wallet.requestAddresses();
  await ensureNetwork();
  return { address };
}

async function runTx(run: (wallet: WalletClient, account: Address) => Promise<Hex>): Promise<string> {
  await ensureNetwork();
  const { wallet, publicClient } = clients();
  const [account] = await wallet.requestAddresses();
  const hash = await run(wallet, account);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error("Transaction failed on-chain");
  return hash;
}

// The same demo loan (LN-1024) can be run many times, but an on-chain ID must be unique.
// So each run gets a unique on-chain ID, remembered for later repayment calls.
const idKey = (loanId: string) => `microlend:onchain-id:${loanId}`;

function rememberOnChainId(loanId: string, onChainId: string) {
  try {
    window.sessionStorage.setItem(idKey(loanId), onChainId);
  } catch {
    // ignore storage problems
  }
}

function onChainIdFor(loanId: string): string {
  try {
    return window.sessionStorage.getItem(idKey(loanId)) ?? loanId;
  } catch {
    return loanId;
  }
}

export async function createLoanOnChain(
  loan: Loan,
): Promise<{ txHash: string; contractAddress: string }> {
  if (DEMO_MODE) {
    await sleep(1500);
    return { txHash: fakeHash(), contractAddress: CONTRACT_ADDRESS };
  }
  const onChainId = `${loan.id}-${Date.now().toString(36)}`;
  const txHash = await runTx((wallet, account) =>
    wallet.writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "createLoan",
      args: [
        onChainId,
        account,
        DEMO_LENDER,
        BigInt(Math.round(loan.principal)),
        BigInt(loan.tenureMonths),
      ],
      account,
      chain: sepolia,
    }),
  );
  rememberOnChainId(loan.id, onChainId);
  return { txHash, contractAddress: CONTRACT_ADDRESS };
}

export async function recordRepaymentOnChain(loanId: string): Promise<{ txHash: string }> {
  if (DEMO_MODE) {
    await sleep(1500);
    return { txHash: fakeHash() };
  }
  const txHash = await runTx((wallet, account) =>
    wallet.writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "recordRepayment",
      args: [onChainIdFor(loanId)],
      account,
      chain: sepolia,
    }),
  );
  return { txHash };
}

export async function completeLoanOnChain(loanId: string): Promise<{ txHash: string }> {
  if (DEMO_MODE) {
    await sleep(1500);
    return { txHash: fakeHash() };
  }
  const txHash = await runTx((wallet, account) =>
    wallet.writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "completeLoan",
      args: [onChainIdFor(loanId)],
      account,
      chain: sepolia,
    }),
  );
  return { txHash };
}

export function explorerTxUrl(txHash: string): string {
  return "https://sepolia.etherscan.io/tx/" + txHash;
}