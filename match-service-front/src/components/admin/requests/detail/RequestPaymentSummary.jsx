import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";
import { BANNER_TONES } from "../RequestBadges";
import { dateOf, money, timeOf } from "../RequestParts";
import { summarizePayment } from "../../../../services/adminRequests";

function Tile({ label, icon, children, hint }) {
  return (
    <div className="px-4 py-3">
      <p className="adm-small text-cream/70">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {icon && <Icon name={icon} size={20} className="text-cream/70" />}
        <div className="min-w-0">{children}</div>
      </div>
      {hint && <p className="adm-small mt-1 text-cream/70">{hint}</p>}
    </div>
  );
}

const Money = ({ cents }) => <p className="adm-stat-number whitespace-nowrap text-cream">{money(cents)}</p>;
const Text = ({ children }) => <p className="adm-text font-medium text-cream">{children}</p>;

/**
 * Resumo do pagamento COERENTE com o status (ver summarizePayment): "pago",
 * "retido" e "repassado" só aparecem quando existe o evento correspondente.
 * Valores fictícios; a confirmação real depende do provedor financeiro.
 */
export default function RequestPaymentSummary({ request }) {
  const s = summarizePayment(request);
  const tone = BANNER_TONES[s.banner.tone];
  return (
    <section aria-labelledby="request-payment" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id="request-payment" icon="card" className="border-b border-hairline pb-3">
        Resumo do pagamento
      </AdminSectionTitle>

      <div className="mt-4 grid divide-hairline rounded-2xl border border-hairline bg-surface-2/60 sm:grid-cols-2 sm:divide-x-0 lg:grid-cols-5 lg:divide-x">
        <Tile label="Valor pago pelo cliente" hint={s.paid.ref ? `${s.paid.hint} ${money(s.paid.ref)}` : s.paid.hint}>
          {s.paid.money ? <Money cents={s.paid.value} /> : <Text>{s.paid.value}</Text>}
        </Tile>
        <Tile label="Método de pagamento" icon={s.method.value === "—" || s.method.value === "Não selecionado" ? null : "card"} hint={s.method.hint}>
          <Text>{s.method.value}</Text>
        </Tile>
        <Tile label="Data do pagamento" icon={s.date.datetime ? "calendar" : null} hint={s.date.hint}>
          {s.date.datetime ? <Text>{dateOf(s.date.value)} às {timeOf(s.date.value)}</Text> : <Text>{s.date.value}</Text>}
        </Tile>
        <Tile label={`Comissão da plataforma (${s.commissionRate}%)`} hint={s.commission.hint}>
          {s.commission.money ? <Money cents={s.commission.value} /> : <Text>{s.commission.value}</Text>}
        </Tile>
        <Tile label="Valor a ser repassado ao fornecedor" hint={s.transfer.hintAt ? `${s.transfer.hint} em ${dateOf(s.transfer.hintAt)}` : s.transfer.hint}>
          {s.transfer.money ? <Money cents={s.transfer.value} /> : <Text>{s.transfer.value}</Text>}
        </Tile>
      </div>

      <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${tone.box}`}>
        <div className="flex min-w-0 items-start gap-3">
          <Icon name={tone.icon} size={22} className={`mt-0.5 ${tone.title}`} />
          <div className="min-w-0">
            <p className={`adm-text font-medium ${tone.title}`}>{s.banner.title}</p>
            {s.banner.text && <p className="adm-text text-cream/70">{s.banner.text}</p>}
            {s.banner.at && <p className="adm-small text-cream/70">Registrado em {dateOf(s.banner.at)} às {timeOf(s.banner.at)}.</p>}
          </div>
        </div>
        <span className={`adm-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 ${tone.pill}`}>
          {s.banner.pill}
        </span>
      </div>

      <p className="adm-small mt-3 text-cream/70">
        Valores fictícios e demonstrativos: nenhuma cobrança, retenção ou transferência real é feita. A confirmação do
        pagamento, a retenção e o repasse dependerão da integração futura com o provedor financeiro (e de seus
        webhooks). Comissão demonstrativa de {s.commissionRate}% para o Match Service e {100 - s.commissionRate}% para
        o fornecedor, antes de taxas e tributos aplicáveis. Neste painel a consulta é somente leitura: o administrador
        não confirma pagamentos nem libera repasses no fluxo normal.
      </p>
    </section>
  );
}
