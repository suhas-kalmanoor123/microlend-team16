import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/landing/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Wordmark />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <a href="#how-it-works">How it works</a>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="group">
            <Link href="/login">
              Try the Demo
              <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
