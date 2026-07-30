interface PageHeroProps {
  title: string;
  subtitle: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
      <p className="mb-8 text-sm text-muted-foreground">{subtitle}</p>
    </>
  );
}
