import { ArrowRight } from "lucide-react";
import type { FeasibilityResult, LoanRequest } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { formatINR, formatTenure } from "@/components/shared/format";

type Column = {
  title: string;
  amount: number;
  tenure: number;
  monthly: number;
  highlight?: boolean;
};

function TermsColumn({ title, amount, tenure, monthly, highlight }: Column) {
  const rows = [
    { label: "Amount", value: formatINR(amount) },
    { label: "Tenure", value: formatTenure(tenure) },
    { label: "Monthly payment", value: formatINR(monthly) },
  ];
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-5", highlight && "bg-primary-soft")}>
      <h3 className={cn("text-xs font-medium uppercase tracking-wide", highlight ? "text-primary" : "text-muted-foreground")}>
        {title}
      </h3>
      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="font-mono text-sm font-medium tabular-nums text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function RequestComparison({ request, result }: { request: LoanRequest; result: FeasibilityResult }) {
  return (
    <section aria-label="Requested versus recommended terms" className="relative overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0">
        <TermsColumn
          title="You requested"
          amount={request.amount}
          tenure={request.tenureMonths}
          monthly={Math.round(request.amount / request.tenureMonths)}
        />
        <TermsColumn
          title="Safer recommendation"
          amount={result.recommendedAmount}
          tenure={result.recommendedTenureMonths}
          monthly={result.recommendedMonthlyPayment}
          highlight
        />
      </div>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 hidden size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-muted-foreground sm:flex"
      >
        <ArrowRight className="size-3.5" />
      </span>
    </section>
  );
}
