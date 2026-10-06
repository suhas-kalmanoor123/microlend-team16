import { AlertTriangle, ArrowRight, Check } from "lucide-react";

const factors = [
  { label: "Stable monthly income", positive: true },
  { label: "2 of 2 previous loans repaid on time", positive: true },
  { label: "Low existing obligations", positive: true },
  { label: "Requested amount exceeds repayment capacity", positive: false },
];

export function PreviewCard() {
  return (
    <figure
      aria-label="Example loan assessment"
      className="rounded-xl border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center justify-between border-b px-5 py-3">
        <p className="text-xs font-medium text-muted-foreground">Feasibility assessment</p>
        <p className="font-mono text-[11px] text-muted-foreground">#ML-20418</p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 px-5 py-5">
        <div className="rounded-lg border bg-muted/60 p-3.5">
          <p className="text-xs text-muted-foreground">Requested</p>
          <p className="mt-1 font-mono text-lg font-medium tracking-tight text-muted-foreground line-through decoration-1">
            ₹30,000
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-warning">
            <AlertTriangle className="size-3" aria-hidden="true" />
            Not recommended
          </p>
        </div>
        <div className="flex items-center text-muted-foreground" aria-hidden="true">
          <ArrowRight className="size-4" />
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary-soft/60 p-3.5">
          <p className="text-xs text-primary">Recommended</p>
          <p className="mt-1 font-mono text-lg font-medium tracking-tight text-foreground">
            ₹12,000
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            3 months · <span className="font-mono text-foreground">₹4,000</span>/mo
          </p>
        </div>
      </div>

      <div className="border-t px-5 py-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Why this recommendation</p>
        <ul className="flex flex-col gap-2.5">
          {factors.map((factor) => (
            <li key={factor.label} className="flex items-start gap-2.5 text-sm text-foreground">
              {factor.positive ? (
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                  <span className="sr-only">Positive factor:</span>
                </span>
              ) : (
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
                  <AlertTriangle className="size-2.5" strokeWidth={3} aria-hidden="true" />
                  <span className="sr-only">Negative factor:</span>
                </span>
              )}
              <span className="leading-snug">{factor.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="flex items-center justify-between border-t bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
        <span>Risk score</span>
        <span className="font-mono text-foreground">Moderate · 0.42</span>
      </figcaption>
    </figure>
  );
}
