export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-brand-dark sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-ink/70">{subtitle}</p>}
      </div>
    </header>
  );
}
