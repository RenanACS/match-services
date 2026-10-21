import Icon from "../../ui/Icon";
import { Card, DemoNote, Fact, RELEASE_STATUS, ReleaseBadge, formatDate, formatMoney, resolveReleaseStatus } from "./RequestParts";

const FLOW = ["awaiting_release", "processing", "released"];

/** Solicitação concluída: conclusão, confirmação do cliente e situação da liberação financeira. */
export default function CompletionCard({ detail, simulated }) {
  const releaseKey = resolveReleaseStatus(detail.release);
  const index = FLOW.indexOf(releaseKey);
  return (
    <Card title="Conclusão e liberação do pagamento" icon="checkCircle" id="completion-title" action={<ReleaseBadge release={detail.release} />}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact icon="calendar" label="Data da conclusão">{formatDate(detail.dates.completedAt)}</Fact>
        <Fact icon="user" label="Confirmação realizada pelo cliente">
          {detail.completion ? `Sim, em ${formatDate(detail.completion.confirmedAt)}` : "Pendente"}
        </Fact>
        <Fact icon="dollar" label="Valor do serviço">{formatMoney(detail.contract.valueCents)}</Fact>
        <Fact icon="wrench" label="Histórico da execução">
          Iniciada em {formatDate(detail.dates.startedAt)}; concluída em {formatDate(detail.dates.completedAt)}
        </Fact>
      </dl>

      <ol className="mt-3 grid gap-2 sm:grid-cols-3" aria-label="Situação da liberação financeira">
        {FLOW.map((key, i) => {
          const state = i < index ? "done" : i === index ? "current" : "pending";
          return (
            <li
              key={key}
              aria-current={state === "current" ? "step" : undefined}
              className={`app-text flex items-center gap-2 rounded-xl border px-3 py-2 ${
                state === "current"
                  ? "border-orange/60 bg-orange-soft text-orange"
                  : state === "done"
                    ? "border-hairline text-cream/80"
                    : "border-hairline text-cream/40"
              }`}
            >
              <Icon name={state === "pending" ? RELEASE_STATUS[key].icon : state === "done" ? "check" : RELEASE_STATUS[key].icon} size={14} />
              {RELEASE_STATUS[key].label}
            </li>
          );
        })}
      </ol>

      <p className="app-text mt-3 text-cream/70">
        {releaseKey === "awaiting_release" &&
          "A conclusão foi informada. A liberação ao fornecedor ainda depende da validação do backend e da solicitação ao provedor financeiro."}
        {releaseKey === "processing" &&
          `A liberação foi solicitada ao provedor financeiro${detail.release?.requestedAt ? ` em ${formatDate(detail.release.requestedAt)}` : ""} e está em processamento. Aguardando a confirmação do provedor.`}
        {releaseKey === "released" &&
          `Pagamento liberado ao fornecedor, confirmado pelo provedor financeiro em ${formatDate(detail.release.confirmedAt)}.`}
      </p>
      {simulated && (
        <div className="mt-3">
          <DemoNote>Conclusão registrada de forma simulada (sem backend). A liberação real depende do backend e do provedor.</DemoNote>
        </div>
      )}
    </Card>
  );
}
