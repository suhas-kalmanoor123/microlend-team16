"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, LoaderCircle, TriangleAlert } from "lucide-react";
import { useAppState } from "@/components/app-state";
import { WalletSlot } from "@/components/shared/wallet-slot";
import { mockLenders } from "@/lib/demo/api";
import { DEMO_MODE, createLoanOnChain, explorerTxUrl } from "@/lib/demo/chain";
import { formatINR, shortHash } from "@/lib/demo/format";

type Phase = "idle" | "signing" | "pending" | "failed";

const wrap = "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6";
const card = "rounded-xl border border-border bg-card p-6";
const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

export function LoanView() {
  const { acceptedLoan: loan, borrower, chainEvents, hydrated, updateLoan, addChainEvent } =
    useAppState();
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rejected, setRejected] = useState(false);

  if (!hydrated) {
    return <div className={wrap + " text-sm text-muted-foreground"}>Loading loan…</div>;
  }

  if (!loan) {
    return (
      <div className={wrap}>
        <div className={card + " text-center"}>
          <h1 className="text-xl font-semibold text-foreground">No loan to show</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start from a borrower profile to create a loan.
          </p>
          <Link href="/borrower" className={primaryButton + " mt-6"}>
            Go to borrower
          </Link>
        </div>
      </div>
    );
  }

  const agreement = chainEvents.find((event) => event.type === "AGREEMENT");
  const lenderName = mockLenders.find((l) => l.id === loan.lenderId)?.name ?? loan.lenderId;
  const borrowerName = borrower?.name ?? loan.borrowerId;

  const handleCreate = async () => {
    if (!connected) return;
    setRejected(false);
    setPhase("signing");
    const timer = setTimeout(() => setPhase("pending"), 900);
    try {
      const result = await createLoanOnChain(loan);
      updateLoan({
        status: "ACTIVE",
        contractAddress: result.contractAddress,
        transactionHash: result.txHash,
      });
      addChainEvent({
        type: "AGREEMENT",
        txHash: result.txHash,
        timestamp: Date.now(),
        label: "Loan agreement recorded",
      });
      setPhase("idle");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setRejected(/reject|denied|cancel/i.test(message));
      setPhase("failed");
    } finally {
      clearTimeout(timer);
    }
  };

  const statusLabel =
    loan.status === "COMPLETED" ? "Completed" : loan.status === "ACTIVE" ? "Active" : "Awaiting agreement";
  const statusClass =
    loan.status === "PENDING"
      ? "bg-amber-500/15 text-amber-500"
      : "bg-emerald-500/15 text-emerald-500";

  const rows: [string, string][] = [
    ["Principal", formatINR(loan.principal)],
    ["Tenure", `${loan.tenureMonths} months`],
    ["Monthly repayment", formatINR(loan.monthlyRepayment)],
    ["Borrower", borrowerName],
    ["Lender", lenderName],
  ];

  return (
    <div className={wrap + " space-y-6"}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Loan #{loan.id}</h1>
        <span className={"rounded-full px-3 py-1 text-xs font-medium " + statusClass}>{statusLabel}</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={card}>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-base font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className={card + " space-y-5"}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Blockchain agreement</h2>
          {DEMO_MODE && (
            <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
              Demo Mode
            </span>
          )}
        </div>

        {agreement ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
              >
                <Check className="h-5 w-5" />
              </motion.span>
              <p className="font-medium text-foreground">Agreement recorded on-chain</p>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Transaction</dt>
                <dd>
                  <a
                    href={explorerTxUrl(agreement.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-indigo-500 hover:underline"
                  >
                    {shortHash(agreement.txHash)}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Contract</dt>
                <dd className="font-mono text-foreground">
                  {loan.contractAddress ? shortHash(loan.contractAddress) : "-"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Network</dt>
                <dd className="text-foreground">Base Sepolia</dd>
              </div>
            </dl>
            <Link href={`/loan/${loan.id}/repayments`} className={primaryButton}>
              Go to repayments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <WalletSlot connected={connected} onConnectedChange={setConnected} />

            {phase === "signing" && (
              <div className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <div>
                  <p className="font-medium">Waiting for wallet signature</p>
                  <p className="text-muted-foreground">Confirm the request in your wallet.</p>
                </div>
              </div>
            )}

            {phase === "pending" && (
              <div className="space-y-3 rounded-lg border border-border p-4 text-sm text-foreground">
                <div className="flex items-center gap-3">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <p className="font-medium">Transaction pending</p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    className="h-full w-1/3 rounded-full bg-indigo-500"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {phase === "failed" && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
                <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-500" />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    {rejected ? "You rejected the transaction" : "The transaction failed"}
                  </p>
                  <p className="text-muted-foreground">
                    {rejected
                      ? "Nothing was recorded. You can try again when you're ready."
                      : "Nothing was recorded. Check your wallet and network, then try again."}
                  </p>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="text-sm font-medium text-indigo-500 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {(phase === "idle" || phase === "failed") && (
              <div>
                <button type="button" onClick={handleCreate} disabled={!connected} className={primaryButton}>
                  Create blockchain agreement
                </button>
                {!connected && (
                  <p className="mt-2 text-xs text-muted-foreground">Connect your wallet to continue.</p>
                )}
              </div>
            )}
          </div>
        )}

        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          Private financial data stays off-chain. Only the agreement and repayment events are recorded
          on-chain.
        </p>
      </motion.div>
    </div>
  );
}