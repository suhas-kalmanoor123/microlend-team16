"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { mockLenders } from "@/lib/demo/api";
import { formatINR } from "@/lib/demo/format";

const wrap = "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6";
const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-500";

const riskLabel: Record<string, string> = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };

export function LenderView() {
  const [selectedId, setSelectedId] = useState<string>(mockLenders[0]?.id ?? "");
  const lender = mockLenders.find((l) => l.id === selectedId) ?? mockLenders[0];

  if (!lender) {
    return <div className={wrap + " text-sm text-muted-foreground"}>No lender profiles available.</div>;
  }

  const rows: [string, string][] = [
    ["Available capital", formatINR(lender.availableCapital)],
    ["Loan range", `${formatINR(lender.minLoanAmount)} to ${formatINR(lender.maxLoanAmount)}`],
    ["Risk preference", riskLabel[lender.riskPreference] ?? lender.riskPreference],
    ["Preferred tenure", `${lender.preferredTenureMonths} months`],
  ];

  return (
    <div className={wrap + " space-y-8"}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Lender dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a lender profile. Your terms decide which borrowers you are matched with.
        </p>
      </div>

      <div className="grid gap-3">
        {mockLenders.map((l) => {
          const active = l.id === lender.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedId(l.id)}
              className={
                "flex items-center justify-between rounded-xl border p-4 text-left transition " +
                (active ? "border-indigo-500 bg-indigo-500/5" : "border-border bg-card hover:bg-foreground/5")
              }
            >
              <div>
                <p className="font-medium text-foreground">{l.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatINR(l.minLoanAmount)} to {formatINR(l.maxLoanAmount)} · risk{" "}
                  {(riskLabel[l.riskPreference] ?? l.riskPreference).toLowerCase()}
                </p>
              </div>
              <span
                className={
                  "h-4 w-4 rounded-full border " + (active ? "border-indigo-500 bg-indigo-500" : "border-border")
                }
              />
            </button>
          );
        })}
      </div>

      <motion.div
        key={lender.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground">{lender.name}</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-base font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/lender/opportunities?lender=${encodeURIComponent(lender.id)}`}
          className={primaryButton + " mt-6"}
        >
          View opportunities
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}