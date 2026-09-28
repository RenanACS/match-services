import { summaryStats } from "../../data/dashboard";

/**
 * Resumo em uma única faixa discreta (em vez de três cards grandes).
 */
export default function SummaryStrip() {
  return (
    <section aria-label="Resumo">
      <dl className="grid grid-cols-1 divide-y divide-hairline rounded-[20px] border border-hairline bg-surface-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {summaryStats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-baseline gap-2 px-4 py-3 sm:px-6"
          >
            <dd className="font-display text-xl font-semibold text-cream">
              {stat.value}
            </dd>
            <dt className="font-mono text-[10px] uppercase leading-snug tracking-widest text-cream/50 sm:text-[11px]">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
