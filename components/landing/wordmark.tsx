import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-md bg-primary font-mono text-[11px] font-semibold text-primary-foreground"
      >
        M
      </span>
      MicroLend
    </Link>
  );
}
