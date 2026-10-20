/** Título da página + descrição + ação principal (botão), padrão do Dashboard. */
export default function PageHeader({ title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-xl text-base text-cream/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
