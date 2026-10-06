import Link from "next/link";
import { Wordmark } from "@/components/landing/wordmark";

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="text-sm text-muted-foreground">Explainable micro-lending, verifiably recorded.</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <Link href="/login" className="transition-colors hover:text-foreground">
            Demo
          </Link>
          <span className="font-mono text-xs">© {new Date().getFullYear()} MicroLend</span>
        </div>
      </div>
    </footer>
  );
}
