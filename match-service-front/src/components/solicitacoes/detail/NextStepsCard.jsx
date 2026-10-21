import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import { Card } from "./RequestParts";

const STEPS = {
  analysis: [
    "A plataforma analisa o seu pedido e encaminha aos fornecedores adequados.",
    "Os fornecedores interessados enviam propostas com valor e prazo.",
    "Você compara as propostas e escolhe a melhor para o seu caso.",
  ],
  proposals: [
    "Compare as propostas recebidas e aceite a que melhor atende você.",
    "Depois de aceitar, você paga à plataforma; o valor fica retido até a conclusão.",
    "Somente após a confirmação do pagamento o serviço é contratado.",
  ],
  awaiting_payment: [
    "Faça o pagamento à plataforma para que o serviço seja contratado.",
    "O pagamento fica retido e só é liberado ao fornecedor depois que você confirmar a conclusão.",
    "A contratação só é concluída quando o provedor financeiro confirmar o pagamento.",
  ],
};

/** "Próximas etapas" para solicitações que ainda não foram contratadas. */
export default function NextStepsCard({ status }) {
  const steps = STEPS[status];
  if (!steps) return null;
  return (
    <Card title="Próximas etapas" icon="info" id="next-steps-title">
      <ol className="flex flex-col gap-2">
        {steps.map((text, index) => (
          <li key={text} className="app-text flex gap-2.5 text-cream/70">
            <span className="app-small flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 font-medium text-cream/80">
              {index + 1}
            </span>
            {text}
          </li>
        ))}
      </ol>
      {status === "awaiting_payment" && (
        <Link
          to="/app/pagamento"
          className="app-button mt-3 inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-orange bg-orange px-4 text-ink transition hover:bg-orange-light"
        >
          <Icon name="payments" size={16} />
          Ir para pagamentos
        </Link>
      )}
    </Card>
  );
}
