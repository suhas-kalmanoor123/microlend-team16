import type { BorrowerProfile } from "@/lib/types";
import { formatINR } from "@/components/shared/format";

export function BorrowerSummary({ borrower }: { borrower: BorrowerProfile }) {
  const items = [
    { label: "Income", value: borrower.monthlyIncome },
    { label: "Expenses", value: borrower.monthlyExpenses },
    { label: "Obligations", value: borrower.existingObligations },
  ];
  return (
    <dl className="grid grid-cols-3 divide-x rounded-lg border bg-muted/50">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</dt>
          <dd className="font-mono text-sm font-medium tabular-nums text-foreground">
            {formatINR(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
