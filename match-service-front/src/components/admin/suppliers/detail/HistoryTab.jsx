import { HISTORY_LABELS, HISTORY_TEXT_LABEL } from "./helpers";
import { formatDateTime } from "../../../../utils/dates";

const DOT = {
  registered: "bg-cream/50",
  approved: "bg-emerald-400",
  unblocked: "bg-emerald-400",
  rejected: "bg-red-400",
  blocked: "bg-red-400",
};

/** Eventos administrativos, do mais recente para o mais antigo. */
export default function HistoryTab({ supplier }) {
  const events = [...supplier.history].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section aria-labelledby="history-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="history-title" className="adm-section-title">Histórico administrativo</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {events.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[event.action]}`} />
            <div className="min-w-0">
              <p className="adm-text font-medium text-cream">{HISTORY_LABELS[event.action]}</p>
              <p className="adm-small text-cream/50">
                {formatDateTime(event.date)} · {event.by}
              </p>
              {event.reason && (
                <p className="mt-1 adm-text text-cream/70">
                  {HISTORY_TEXT_LABEL[event.action]}: {event.reason}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
