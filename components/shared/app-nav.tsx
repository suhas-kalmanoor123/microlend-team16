import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/landing/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

type AppNavProps = {
  backHref: string;
  backLabel: string;
};

export function AppNav({ backHref, backLabel }: AppNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <div className="flex min-w-0 items-center gap-4">
          <Wordmark />
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <Link
            href={backHref}
            className="group inline-flex min-w-0 items-center gap-1.5 rounded-md text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft
              className="size-3.5 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span className="truncate">{backLabel}</span>
          </Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
