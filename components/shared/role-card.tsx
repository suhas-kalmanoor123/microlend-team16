import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type RoleCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
};

export function RoleCard({ href, icon: Icon, title, description, points }: RoleCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border bg-card p-6 shadow-card transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-10 items-center justify-center rounded-lg border bg-primary-soft text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
      <ul className="mt-5 flex flex-col gap-2 border-t pt-5">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1 rounded-full bg-border-strong" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-primary">
        Continue as {title.toLowerCase()}
        <ArrowRight
          className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
