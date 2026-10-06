"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewCard } from "@/components/landing/preview-card";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-start"
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Explainable micro-lending
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
            Borrow smarter.
            <br />
            <span className="text-muted-foreground">Lend with confidence.</span>
          </h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            AI-powered micro-lending with explainable risk assessment and
            blockchain-backed loan records.
          </p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/login">
                Try the Demo
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <a href="#how-it-works">
                See How It Works
                <ArrowDown className="text-muted-foreground transition-transform duration-150 group-hover:translate-y-0.5" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <PreviewCard />
        </motion.div>
      </div>
    </section>
  );
}
