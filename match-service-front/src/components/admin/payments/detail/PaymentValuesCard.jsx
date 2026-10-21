import AdminSectionTitle from "../../AdminSectionTitle";
import { ValueTag } from "../PaymentBadges";
import { money } from "../../requests/RequestParts";

function Value({ label, children, tag, first = false }) {
  return (
    <div className={`px-0 py-3 sm:px-5 ${first ? "sm:pl-0" : "sm:border-l sm:border-hairline"} xl:py-1.5`}>
      <p className="adm-text text-cream/60">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {children}
        {tag}
      </div>
    </div>
  );
}

const Money = ({ cents, muted }) => <span className={`adm-stat-number whitespace-nowrap ${muted ? "text-cream/70" : "text-cream"}`}>{money(cents)}</span>;
const Dash = () => <span className="adm-stat-number text-cream/50">—</span>;

/**
 * Valores da transação. O valor total é o contratado; comissão e valor ao
 * fornecedor aparecem como PREVISTO até o repasse ser concluído (nunca como
 * dinheiro já recebido ou transferido sem o evento correspondente).
 */
export default function PaymentValuesCard({ payment }) {
  const refunded = payment.status === "refunded";
  return (
    <section aria-labelledby="payment-values" className="rounded-[20px] border border-hairline bg-surface-1 p-5 xl:py-4">
      <AdminSectionTitle id="payment-values" icon="dollar">Valores da transação</AdminSectionTitle>
      <div className="mt-2 grid sm:grid-cols-3">
        <Value first label="Valor total do serviço">
          <Money cents={payment.totalCents} />
        </Value>
        <Value
          label={`Comissão da plataforma (${payment.commissionRate}%)`}
          tag={refunded ? null : <ValueTag effective={payment.commissionEffective}>{payment.commissionEffective ? "Efetivada" : "Previsto"}</ValueTag>}
        >
          {refunded ? <Dash /> : <Money cents={payment.commissionCents} muted={!payment.commissionEffective} />}
        </Value>
        <Value
          label={`Valor ao fornecedor (${100 - payment.commissionRate}%)`}
          tag={refunded ? null : <ValueTag effective={payment.payoutValueEffective}>{payment.payoutValueEffective ? "Repassado" : "Previsto"}</ValueTag>}
        >
          {refunded ? <Dash /> : <Money cents={payment.payoutCents} muted={!payment.payoutValueEffective} />}
        </Value>
      </div>
    </section>
  );
}
