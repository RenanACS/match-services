import { summarizeFinance } from "../../../../services/adminSuppliers";
import { formatBRL } from "../../../../utils/currency";

function Tile({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-2 px-4 py-3">
      <p className="adm-small text-cream/60">{label}</p>
      <p className="mt-1 adm-stat-number text-cream">{value}</p>
      {hint && <p className="mt-0.5 adm-small text-cream/40">{hint}</p>}
    </div>
  );
}

/**
 * Resumo financeiro DEMONSTRATIVO. Nenhum pagamento real ou movimentação é
 * feito: a comissão é de 10% e 90% vão ao fornecedor, antes de taxas e
 * tributos aplicáveis.
 */
export default function FinanceTab({ supplier }) {
  const f = summarizeFinance(supplier.finance);
  return (
    <section aria-labelledby="finance-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="finance-title" className="adm-section-title">Resumo financeiro</h2>
      {f.contracted === 0 && (
        <p className="mt-3 adm-text text-cream/60">Sem movimentações: este fornecedor ainda não prestou serviços na plataforma.</p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Tile label="Serviços contratados" value={f.contracted} hint={`${f.completed} concluídos · ${f.inProgress} em andamento`} />
        <Tile label="Valores pagos" value={formatBRL(f.paidCents)} hint="Serviços concluídos" />
        <Tile label="Aguardando conclusão" value={formatBRL(f.awaitingCents)} hint="Serviços em andamento" />
        <Tile label="Repasses realizados" value={formatBRL(f.payoutCents)} hint={`${100 - f.commissionRate}% do valor pago`} />
        <Tile label={`Comissão da plataforma (${f.commissionRate}%)`} value={formatBRL(f.commissionCents)} hint="Match Service" />
      </div>
      <p className="mt-4 rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-small leading-relaxed text-cream/60">
        Valores fictícios e demonstrativos: nenhum pagamento real foi processado. A comissão demonstrativa é de{" "}
        {f.commissionRate}%, com {100 - f.commissionRate}% destinados ao fornecedor, antes de taxas e tributos
        aplicáveis. Um bloqueio não cancela serviços contratados, pagamentos ou repasses existentes.
      </p>
    </section>
  );
}
