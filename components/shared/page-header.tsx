type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
