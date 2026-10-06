"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  BrainCircuit,
  FileLock2,
  Handshake,
  LineChart,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type Step = { icon: LucideIcon; title: string; description: string };

const steps: Step[] = [
  { icon: UserRound, title: "Borrower", description: "Submits a loan request with basic financial details." },
  { icon: LineChart, title: "Financial analysis", description: "Income, expenses and obligations become a clear profile." },
  { icon: BrainCircuit, title: "AI feasibility", description: "A model scores risk and explains every factor behind it." },
  { icon: Handshake, title: "Smart match", description: "Paired with lenders whose risk appetite fits the loan." },
  { icon: FileLock2, title: "Blockchain loan record", description: "Loan terms are hashed and anchored on-chain." },
  { icon: BadgeCheck, title: "Verified repayment", description: "Each repayment is recorded and independently verifiable." },
];

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const line: Variants = {
  hidden: { scaleX: 0, scaleY: 0 },
  visible: { scaleX: 1, scaleY: 1, transition: { duration: 0.5, ease, delay: 0.2 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-b">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">How it works</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            From request to verified repayment, in six steps.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Every decision is explained, every match is reasoned, and every loan leaves a
            tamper-evident trail.
          </p>
        </div>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-14 grid gap-0 lg:grid-cols-6 lg:gap-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <motion.li
                key={step.title}
                variants={item}
                className="group relative flex gap-4 pb-10 last:pb-0 lg:flex-col lg:gap-5 lg:pb-0"
              >
                {!isLast && (
                  <>
                    <motion.span
                      aria-hidden="true"
                      variants={line}
                      style={{ originY: 0 }}
                      className="absolute top-11 bottom-1 left-5 w-px bg-border lg:hidden"
                    />
                    <motion.span
                      aria-hidden="true"
                      variants={line}
                      style={{ originX: 0 }}
                      className="absolute top-5 left-12 hidden h-px w-[calc(100%-1.5rem)] bg-border lg:block"
                    />
                  </>
                )}
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-xs transition-colors duration-200 group-hover:border-primary/40 group-hover:text-primary">
                  <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-[15px] font-medium tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
