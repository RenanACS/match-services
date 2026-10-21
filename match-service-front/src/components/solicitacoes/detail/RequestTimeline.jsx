import Icon from "../../ui/Icon";
import { Card, formatDate, resolveReleaseStatus } from "./RequestParts";

const STEPS = [
  { key: "created", label: "Solicitação enviada", dateKey: "createdAt" },
  { key: "analysis", label: "Em análise pela plataforma", dateKey: "analysisAt" },
  { key: "proposals", label: "Propostas recebidas", dateKey: "proposalsAt" },
  { key: "accepted", label: "Proposta aceita", dateKey: "acceptedAt" },
  { key: "paid", label: "Pagamento confirmado (retido pela plataforma)", dateKey: "paidAt" },
  { key: "execution", label: "Serviço em execução", dateKey: "startedAt" },
  { key: "completed", label: "Conclusão confirmada pelo cliente", dateKey: "completedAt" },
  { key: "released", label: "Pagamento liberado ao fornecedor", dateKey: null },
];

// Etapa atual por status da solicitação.
function currentIndex(status, release) {
  switch (status) {
    case "analysis":
      return 1;
    case "proposals":
      return 2;
    case "awaiting_payment":
      return 4;
    case "hired":
      return 5;
    case "completed":
      return resolveReleaseStatus(release) === "released" ? STEPS.length : 7;
    default:
      return 0;
  }
}

/** Linha do tempo de acompanhamento (todas as situações). */
export default function RequestTimeline({ status, detail }) {
  const current = currentIndex(status, detail.release);
  return (
    <Card title="Linha do tempo" icon="history" id="timeline-title">
      <ol className="flex flex-col">
        {STEPS.map((step, index) => {
          const state = index < current ? "done" : index === current ? "current" : "pending";
          const date = step.key === "released" ? detail.release?.confirmedAt : detail.dates?.[step.dateKey];
          const last = index === STEPS.length - 1;
          let note = null;
          if (step.key === "released" && state === "current") {
            note = resolveReleaseStatus(detail.release) === "processing" ? "Liberação em processamento" : "Aguardando liberação";
          }
          return (
            <li key={step.key} className="flex gap-3" aria-current={state === "current" ? "step" : undefined}>
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    state === "done"
                      ? "border-orange bg-orange text-ink"
                      : state === "current"
                        ? "border-orange text-orange"
                        : "border-hairline text-cream/30"
                  }`}
                >
                  {state === "done" ? <Icon name="check" size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                {!last && <span className={`my-0.5 w-px flex-1 ${state === "done" ? "bg-orange/60" : "bg-hairline"}`} />}
              </div>
              <div className={`min-w-0 ${last ? "" : "pb-2.5"}`}>
                <p className={`app-text ${state === "pending" ? "text-cream/40" : state === "current" ? "font-medium text-orange" : "text-cream/90"}`}>
                  {step.label}
                </p>
                {(date && state !== "pending") || note ? (
                  <p className="app-small text-cream/50">{note ?? formatDate(date)}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
