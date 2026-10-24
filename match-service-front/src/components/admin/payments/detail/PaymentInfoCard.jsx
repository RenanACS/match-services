import Icon from "../../AdminIcons";
import { PaymentStatusBadge } from "../PaymentBadges";
import { dateOf, timeOf } from "../../requests/RequestParts";

const Divider = () => <div aria-hidden="true" className="hidden self-stretch border-l border-hairline lg:block" />;

/**
 * Cartão horizontal "Informações do pagamento": número e criação | situação |
 * método e identificador da transação. A DATA DE CRIAÇÃO é separada da de
 * CONFIRMAÇÃO (só aparece quando o pagamento foi confirmado). Método e
 * identificador só aparecem quando existem.
 */
export default function PaymentInfoCard({ payment }) {
  const methodIcon = payment.method === "Pix" ? "dollar" : "card";
  return (
    <section aria-label="Informações do pagamento" className="grid gap-4 rounded-[20px] border border-hairline bg-surface-1 p-5 lg:grid-cols-[1.1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-6 xl:py-3.5">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange">
          <Icon name="payments" size={30} />
        </span>
        <div className="min-w-0">
          <p className="adm-small text-cream/70">Pagamento</p>
          <p className="adm-stat-number text-cream">#{payment.id}</p>
          <p className="adm-small mt-1 text-cream/70">Criado em {dateOf(payment.createdAt)} às {timeOf(payment.createdAt)}</p>
          {payment.confirmedAt && (
            <p className="adm-small text-cream/70">Confirmado em {dateOf(payment.confirmedAt)} às {timeOf(payment.confirmedAt)}</p>
          )}
        </div>
      </div>

      <Divider />

      <div>
        <p className="adm-small text-cream/70">Situação</p>
        <div className="mt-1.5"><PaymentStatusBadge status={payment.status} /></div>
        <p className="adm-small mt-1.5 max-w-[260px] text-cream/70">{payment.statusNote}</p>
      </div>

      <Divider />

      <div className="min-w-0">
        <p className="adm-small text-cream/70">Método de pagamento</p>
        {payment.method ? (
          <p className="adm-text mt-1.5 flex items-center gap-2 font-medium text-cream">
            <Icon name={methodIcon} size={20} className="text-cream/70" />
            <span>{payment.method}{payment.methodDetail ? <span className="font-normal text-cream/70"> · {payment.methodDetail}</span> : null}</span>
          </p>
        ) : (
          <p className="adm-text mt-1.5 text-cream/70">Ainda não selecionado</p>
        )}
        <p className="adm-small mt-2 text-cream/70">ID da transação</p>
        {payment.txnId ? (
          <p className="adm-small mt-0.5 break-all font-mono text-cream">{payment.txnId}</p>
        ) : (
          <p className="adm-small mt-0.5 text-cream/70">Não disponível</p>
        )}
      </div>
    </section>
  );
}
