export default function PageHeader({ title, intro, actions }: { title: string; intro?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {intro && <p className="mt-1 max-w-prose text-muted">{intro}</p>}
      </div>
      {actions}
    </div>
  );
}
