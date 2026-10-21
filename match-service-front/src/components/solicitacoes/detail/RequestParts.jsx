import Badge from "../../ui/Badge";
import Icon from "../../ui/Icon";
import { REQUEST_STATUS } from "../../../data/dashboard";

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatMoney(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Cartão padrão das telas de detalhe (mesmo visual compacto do restante da área). */
export function Card({ title, icon, id, children, className = "", action }) {
  return (
    <section aria-labelledby={id} className={`rounded-[20px] border border-hairline bg-surface-1 p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-hairline pb-2.5">
        <h2 id={id} className="app-section-title flex items-center gap-2.5 text-cream">
          {icon && <Icon name={icon} size={18} className="text-cream/70" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Par rótulo/valor com ícone discreto. */
export function Fact({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      {icon && <Icon name={icon} size={16} className="mt-0.5 text-cream/50" />}
      <div className="min-w-0">
        <dt className="app-small text-cream/50">{label}</dt>
        <dd className="app-text mt-0.5 text-cream/90">{children}</dd>
      </div>
    </div>
  );
}

export function RequestStatusBadge({ status }) {
  const info = REQUEST_STATUS[status];
  return <Badge variant={info.variant} appearance="app">{info.label}</Badge>;
}

// Situação da liberação do pagamento ao fornecedor (só em solicitações concluídas).
export const RELEASE_STATUS = {
  awaiting_release: { label: "Aguardando liberação", variant: "warning", icon: "clock" },
  processing: { label: "Liberação em processamento", variant: "orange", icon: "refresh" },
  released: { label: "Pagamento liberado", variant: "success", icon: "checkCircle" },
};

/**
 * Nunca mostra "Pagamento liberado" sem a confirmação do provedor
 * (`confirmedAt`): sem ela, cai em "Liberação em processamento"/"Aguardando".
 */
export function resolveReleaseStatus(release) {
  if (!release) return "awaiting_release";
  if (release.status === "released") return release.confirmedAt ? "released" : "processing";
  return release.status in RELEASE_STATUS ? release.status : "awaiting_release";
}

export function ReleaseBadge({ release }) {
  const info = RELEASE_STATUS[resolveReleaseStatus(release)];
  return (
    <Badge variant={info.variant} appearance="app">
      <Icon name={info.icon} size={12} />
      {info.label}
    </Badge>
  );
}

/** Aviso padrão de que a operação é simulada (sem backend). */
export function DemoNote({ children }) {
  return (
    <p className="app-small flex items-start gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-cream/60">
      <Icon name="info" size={14} className="mt-0.5 shrink-0 text-cream/50" />
      <span>{children}</span>
    </p>
  );
}
