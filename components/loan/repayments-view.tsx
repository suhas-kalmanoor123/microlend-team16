"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ExternalLink, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { useAppState, type ChainEvent } from "@/components/app-state";
import {
  DEMO_MODE,
  completeLoanOnChain,
  explorerTxUrl,
  recordRepaymentOnChain,
} from "@/lib/demo/chain";
import { formatINR, formatTime, shortHash } from "@/lib/demo/format";

const wrap = "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6";
const card = "rounded-xl border border-border bg-card p-6";
const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";

function EventList({ events }: { events: ChainEvent[] }) {
  return (
    <ul className="divide-y divide-border">
      {events.map((event, index) => (
        <motion.li
          key={event.txHash}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-center justify-between gap-4 py-3 text-sm"
        >
          <div>
            <p className="font-medium text-foreground">{event.label}</p>
            <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
          </div>
          <a
            href={explorerTxUrl(event.txHash)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-indigo-500 hover:underline"
          >
            {shortHash(event.txHash)}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </motion.li>
      ))}
    </ul>
  );
}

export function RepaymentsView() {
  const router = useRouter();
  const { acceptedLoan: loan, chainEvents, hydrated, updateLoan, addChainEvent, reset } = useAppState();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ rejected: boolean } | null>(null);

  if (!hydrated) {
    return <div className={wrap + " text-sm text-muted-foreground"}>Loading repayments…</div>;
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

  const tenure = loan.tenureMonths;
  const made = loan.repaymentsMade ?? 0;
  const total = loan.monthlyRepayment * tenure;
  const paid = made * loan.monthlyRepayment;
  const percent = total > 0 ? Math.min(100, (paid / total) * 100) : 0;
  const completed = loan.status === "COMPLETED";
  const hasAgreement = chainEvents.some((event) => event.type === "AGREEMENT");
  const needsCompletion = made >= tenure && !completed;

  const handleSimulate = async () => {
    if (busy || completed || !hasAgreement) return;
    setError(null);
    try {
      let next = made;
      if (made < tenure) {
        setBusy("Recording repayment…");
        const repayment = await recordRepaymentOnChain(loan.id);
        next = made + 1;
        updateLoan({ repaymentsMade: next, status: "ACTIVE" });
        addChainEvent({
          type: "REPAYMENT",
          txHash: repayment.txHash,
          timestamp: Date.now(),
          label: `Repayment ${next} of ${tenure}`,
        });
      }
      if (next >= tenure) {
        setBusy("Completing loan…");
        const completion = await completeLoanOnChain(loan.id);
        updateLoan({ status: "COMPLETED" });
        addChainEvent({
          type: "COMPLETION",
          txHash: completion.txHash,
          timestamp: Date.now(),
          label: "Loan completed",
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError({ rejected: /reject|denied|cancel/i.test(message) });
    } finally {
      setBusy(null);
    }
  };

  const handleRestart = () => {
    reset();
    router.push("/login");
  };

  return (
    <div className={wrap + " space-y-6"}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Loan #{loan.id}</h1>
        {DEMO_MODE && (
          <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            Demo Mode
          </span>
        )}
      </div>

      <div className={card + " space-y-4"}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Principal</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{formatINR(loan.principal)}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{formatINR(paid)}</span> / {formatINR(total)}
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <ol className="space-y-3 pt-2">
          {Array.from({ length: tenure }, (_, i) => i + 1).map((month) => {
            const done = month <= made;
            const next = month === made + 1 && !completed;
            return (
              <li key={month} className="flex items-center gap-3 text-sm">
                <span
                  className={
                    "flex h-6 w-6 items-center justify-center rounded-full border " +
                    (done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : next
                        ? "border-indigo-500"
                        : "border-border")
                  }
                >
                  {done && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="font-medium text-foreground">Month {month}</span>
                <span className="ml-auto text-muted-foreground">
                  {done ? "Recorded" : next ? "Due next" : "Upcoming"}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {!completed && (
        <div className={card + " space-y-4"}>
          {!hasAgreement && (
            <p className="text-sm text-muted-foreground">
              Create the blockchain agreement first.{" "}
              <Link href={`/loan/${loan.id}`} className="font-medium text-indigo-500 hover:underline">
                Back to loan
              </Link>
            </p>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
              <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">
                  {error.rejected ? "You rejected the transaction" : "The transaction failed"}
                </p>
                <p className="text-muted-foreground">Nothing was recorded. Please try again.</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSimulate}
            disabled={Boolean(busy) || !hasAgreement}
            className={primaryButton}
          >
            {busy ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {busy}
              </>
            ) : needsCompletion ? (
              "Complete loan"
            ) : (
              "Simulate repayment"
            )}
          </button>

          {chainEvents.length > 0 && (
            <div className="pt-2">
              <h2 className="mb-1 text-sm font-semibold text-foreground">Transactions</h2>
              <EventList events={chainEvents} />
            </div>
          )}
        </div>
      )}

      {completed && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={card + " flex items-center gap-4"}
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
            >
              <Check className="h-6 w-6" />
            </motion.span>
            <div>
              <p className="text-lg font-semibold text-foreground">Loan fully repaid</p>
              <p className="text-sm text-muted-foreground">
                Every repayment is recorded on-chain and can be verified independently.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={card}
          >
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-base font-semibold text-foreground">Verified repayment history</h2>
            </div>
            <EventList events={chainEvents} />
          </motion.div>

          <button type="button" onClick={handleRestart} className={primaryButton}>
            Start another demo
          </button>
        </>
      )}
    </div>
  );
}