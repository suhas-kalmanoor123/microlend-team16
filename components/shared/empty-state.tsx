import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

export function EmptyState({ icon: Icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="flex size-10 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1.5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Button asChild size="sm" className="mt-6">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
