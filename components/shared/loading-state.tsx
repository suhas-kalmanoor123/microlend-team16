export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col gap-4" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="h-7 w-56 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-48 animate-pulse rounded-xl border bg-card" />
    </div>
  );
}
