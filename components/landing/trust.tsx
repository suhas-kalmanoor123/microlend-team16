"use client";

import { motion } from "framer-motion";
import { Eye, Link2, ShieldCheck, type LucideIcon } from "lucide-react";

type Point = { icon: LucideIcon; title: string; description: string };

const points: Point[] = [
  {
    icon: Eye,
    title: "Explainable, not a black box",
    description:
      "Every assessment lists the factors that shaped it, so borrowers and lenders see exactly why.",
  },
  {
    icon: ShieldCheck,
    title: "Private data stays off-chain",
    description:
      "Personal and financial details never touch the ledger. Only a cryptographic fingerprint does.",
  },
  {
    icon: Link2,
    title: "Verifiable on-chain record",
    description:
      "Loan terms and repayments are anchored on-chain, so anyone can confirm nothing was altered.",
  },
];

export function Trust() {
  return (
    <section aria-labelledby="trust-heading" className="border-b bg-card">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
        <h2
          id="trust-heading"
          className="max-w-lg text-balance text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl"
        >
          Built for trust on both sides of the loan.
        </h2>
        <div className="mt-12 grid overflow-hidden rounded-xl border md:grid-cols-3">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="border-b bg-background p-6 transition-colors duration-200 last:border-b-0 hover:bg-card md:border-r md:border-b-0 md:p-8 md:last:border-r-0"
              >
                <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="mt-5 text-base font-medium tracking-tight text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
