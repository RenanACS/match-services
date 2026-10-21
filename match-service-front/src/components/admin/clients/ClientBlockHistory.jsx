import { formatDateTime } from "../../../utils/dates";

/** Histórico demonstrativo de bloqueios e desbloqueios da conta. */
export default function ClientBlockHistory({ history }) {
  return (
    <section aria-labelledby="block-history-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="block-history-title" className="adm-section-title">
        Histórico da conta
      </h2>
      {history.length === 0 ? (
        <p className="mt-3 adm-text text-cream/60">Nenhum bloqueio ou desbloqueio registrado.</p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-hairline">
          {[...history].reverse().map((entry) => (
            <li key={entry.id} className="py-3 adm-text">
              <p className="font-medium text-cream">
                {entry.action === "blocked" ? "Conta bloqueada" : "Conta desbloqueada"}
              </p>
              {entry.reason && <p className="mt-0.5 text-cream/70">Justificativa: {entry.reason}</p>}
              <p className="mt-0.5 adm-small text-cream/40">
                {formatDateTime(entry.date)} · {entry.by}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
