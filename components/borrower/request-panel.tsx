"use client";

import { useId } from "react";
import { cn } from "@/components/ui/cn";
import { formatINR, formatNumber } from "@/components/shared/format";

export const MIN_AMOUNT = 1000;
export const MAX_AMOUNT = 200000;
const TENURES = [1, 2, 3, 4, 5, 6];

type RequestPanelProps = {
  amount: number;
  tenure: number;
  onAmountChange: (amount: number) => void;
  onTenureChange: (tenure: number) => void;
};

export function RequestPanel({ amount, tenure, onAmountChange, onTenureChange }: RequestPanelProps) {
  const amountId = useId();
  const hintId = useId();
  const tenureLabelId = useId();
  const invalid = amount < MIN_AMOUNT || amount > MAX_AMOUNT;
  const monthly = tenure > 0 ? Math.round(amount / tenure) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor={amountId} className="text-sm font-medium text-foreground">
          Loan amount
        </label>
        <div
          className={cn(
            "flex h-12 items-center gap-2 rounded-lg border bg-background px-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30",
            invalid && "border-warning",
          )}
        >
          <span className="font-mono text-base text-muted-foreground" aria-hidden="true">
            ₹
          </span>
          <input
            id={amountId}
            inputMode="numeric"
            autoComplete="off"
            value={amount === 0 ? "" : formatNumber(amount)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 7);
              onAmountChange(digits ? Number(digits) : 0);
            }}
            aria-invalid={invalid}
            aria-describedby={hintId}
            className="w-full bg-transparent font-mono text-lg font-medium tabular-nums text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="30,000"
          />
        </div>
        <p id={hintId} className={cn("text-xs", invalid ? "text-warning" : "text-muted-foreground")}>
          {invalid
            ? `Enter an amount between ${formatINR(MIN_AMOUNT)} and ${formatINR(MAX_AMOUNT)}.`
            : `${formatINR(MIN_AMOUNT)} to ${formatINR(MAX_AMOUNT)}`}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span id={tenureLabelId} className="text-sm font-medium text-foreground">
          Tenure
        </span>
        <div role="radiogroup" aria-labelledby={tenureLabelId} className="grid grid-cols-6 gap-1 rounded-lg border bg-muted/50 p-1">
          {TENURES.map((months) => {
            const selected = months === tenure;
            return (
              <button
                key={months}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`${months} month${months === 1 ? "" : "s"}`}
                onClick={() => onTenureChange(months)}
                className={cn(
                  "h-9 rounded-md font-mono text-sm tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {months}
                <span className="text-[11px] text-muted-foreground">m</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-dashed px-3.5 py-3">
        <span className="text-sm text-muted-foreground">Estimated monthly payment</span>
        <span className="font-mono text-sm font-medium tabular-nums text-foreground">
          {invalid ? "—" : formatINR(monthly)}
        </span>
      </div>
    </div>
  );
}
