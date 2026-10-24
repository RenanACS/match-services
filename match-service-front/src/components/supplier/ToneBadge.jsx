import { CheckIcon, ClockIcon, GearIcon, XIcon } from "./icons";

const TONES = {
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-400",
  orange: "border-orange/40 bg-orange-soft text-orange",
  neutral: "border-hairline text-cream/70",
};

// Só os tons da referência visual (status de solicitação) levam ícone.
const ICONS = { warning: ClockIcon, info: GearIcon, success: CheckIcon, danger: XIcon, orange: ClockIcon };

/**
 * Selo colorido de status (solicitação, proposta, pagamento, serviço...).
 * O Badge genérico (components/ui) não tem as variantes azul/neutra com
 * ícone, então este fica na pasta do fornecedor sem alterar o compartilhado.
 */
export default function ToneBadge({ tone = "neutral", label, withIcon = false }) {
  const Icon = withIcon ? ICONS[tone] : null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border app-badge px-2.5 py-0.5 ${TONES[tone]}`}
    >
      {Icon && <Icon width={13} height={13} />}
      {label}
    </span>
  );
}
