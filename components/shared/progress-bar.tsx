"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/ui/cn";

type ProgressBarProps = {
  value: number;
  label: string;
  className?: string;
  barClassName?: string;
  delay?: number;
};

export function ProgressBar({ value, label, className, barClassName, delay = 0 }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className={cn("h-full rounded-full bg-primary", barClassName)}
      />
    </div>
  );
}
