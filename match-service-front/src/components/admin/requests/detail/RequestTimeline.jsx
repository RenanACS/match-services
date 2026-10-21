import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import { buildTimeline } from "../../../../services/adminRequests";
import { dateOf, timeOf } from "../RequestParts";

function Circle({ state, number }) {
  const base = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2";
  if (state === "done") return <span className={`${base} border-orange bg-orange text-ink`}><Icon name="check" size={18} /></span>;
  if (state === "stopped") return <span className={`${base} border-red-500 bg-red-500 text-white`}><Icon name="close" size={18} /></span>;
  if (state === "current") return <span className={`${base} adm-text border-orange/70 font-medium text-orange`}>{number}</span>;
  return <span className={`${base} adm-text border-hairline font-medium text-cream/50`}>{number}</span>;
}

const labelColor = { done: "text-cream", stopped: "text-red-400", current: "text-cream/80", inactive: "text-cream/50" };

function StepText({ step, align }) {
  return (
    <div className={align}>
      <p className={`adm-small font-medium ${labelColor[step.state]}`}>{step.label}</p>
      {step.at && (
        <p className="adm-small text-cream/55">
          {dateOf(step.at)} {timeOf(step.at)}
        </p>
      )}
    </div>
  );
}

/**
 * Linha do tempo derivada dos EVENTOS da solicitação (ver buildTimeline): só
 * marca como concluída a etapa que tem evento. Recusa/cancelamento mostram a
 * situação na etapa em que o fluxo parou; as seguintes ficam inativas.
 */
export default function RequestTimeline({ request }) {
  const steps = buildTimeline(request);
  const reached = (index) => steps[index]?.state === "done";
  return (
    <section aria-labelledby="request-timeline" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id="request-timeline" icon="history">Linha do tempo</AdminSectionTitle>
      <p className="adm-text mt-1 text-cream/60">Acompanhe as principais etapas da solicitação.</p>

      {/* desktop: círculos conectados por uma linha horizontal */}
      <ol className="mt-5 hidden md:flex" aria-label="Etapas da solicitação">
        {steps.map((step, index) => (
          <li key={step.key} className="flex flex-1 flex-col items-center text-center" aria-current={step.state === "current" ? "step" : undefined}>
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${index === 0 ? "bg-transparent" : reached(index) || step.state === "stopped" ? (step.state === "stopped" ? "bg-red-500/60" : "bg-orange") : "bg-hairline"}`} />
              <Circle state={step.state} number={index + 1} />
              <span className={`h-0.5 flex-1 ${index === steps.length - 1 ? "bg-transparent" : reached(index + 1) ? "bg-orange" : "bg-hairline"}`} />
            </div>
            <StepText step={step} align="mt-2 px-2" />
          </li>
        ))}
      </ol>

      {/* celular: lista vertical */}
      <ol className="mt-5 flex flex-col gap-4 md:hidden" aria-label="Etapas da solicitação">
        {steps.map((step, index) => (
          <li key={step.key} className="flex items-start gap-3" aria-current={step.state === "current" ? "step" : undefined}>
            <Circle state={step.state} number={index + 1} />
            <StepText step={step} align="pt-1.5" />
          </li>
        ))}
      </ol>

      {request.cancellation && (
        <p className="adm-text mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-red-300">
          {request.cancellation.by === "supplier" ? "Recusada pelo fornecedor" : "Cancelada pelo cliente"} em {dateOf(request.cancellation.at)}{" "}
          às {timeOf(request.cancellation.at)}. Motivo: {request.cancellation.reason}
        </p>
      )}
      {request.dispute && (
        <p className="adm-text mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-amber-300">
          Contestação aberta em {dateOf(request.dispute.openedAt)}: {request.dispute.reason} O tratamento é feito em
          Contestações (ainda não disponível nesta demonstração).
        </p>
      )}
    </section>
  );
}
