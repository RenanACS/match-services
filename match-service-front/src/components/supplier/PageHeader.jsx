/** Título da página + descrição + ação principal (botão), padrão do Dashboard. */
export default function PageHeader({ title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="app-page-title text-cream">
          {title}
        </h1>
        {description && <p className="app-text mt-1 max-w-xl text-cream/70">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
