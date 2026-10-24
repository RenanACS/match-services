import Icon from "./Icon";

const STATES = {
  pending: { icon: "lock", tone: "text-cream/70", label: "Custódia", client: "retida após o pagamento", supplier: "retida após o pagamento do cliente" },
  held: { icon: "lock", tone: "text-orange", label: "Em custódia", client: "retido até você aprovar a entrega", supplier: "retido até o cliente aprovar a entrega" },
  released: { icon: "shieldCheck", tone: "text-emerald-400", label: "Liberado", client: "entrega aprovada, valor repassado", supplier: "entrega aprovada, valor repassado a você" },
};

/**
 * Linha de custódia: torna visível o mecanismo central do produto (o valor
 * fica retido até o contratante aprovar a entrega). `state`: pending | held |
 * released. `audience`: client | supplier muda só o texto. `compact` mostra só
 * o rótulo (a explicação vai no title), para colunas estreitas de tabela.
 */
export default function CustodyNote({ state, audience = "client", compact = false, className = "" }) {
  const item = STATES[state];
  if (!item) return null;
  return (
    <p className={`app-small flex items-center gap-1.5 ${className}`} title={compact ? item[audience] : undefined}>
      <Icon name={item.icon} size={14} className={`shrink-0 ${item.tone}`} />
      <span className={`font-medium ${item.tone}`}>{item.label}</span>
      {!compact && <span className="text-cream/70">· {item[audience]}</span>}
    </p>
  );
}
