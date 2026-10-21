import SupplierActionDialog from "./SupplierActionDialog";
import SupplierReasonDialog from "./SupplierReasonDialog";

export const DECISION_NOTICES = {
  approve: (name) => `Cadastro de ${name} aprovado (ação demonstrativa).`,
  reject: (name) => `Cadastro de ${name} rejeitado (ação demonstrativa).`,
  block: (name) => `${name} bloqueado (ação demonstrativa).`,
  unblock: (name) => `${name} desbloqueado (ação demonstrativa).`,
};

/**
 * Renderiza o modal correspondente à ação escolhida (lista ou detalhes).
 * `dialog` = { supplier, mode } com mode = approve | reject | block |
 * unblock | reason.
 */
export default function SupplierDialogs({ dialog, onConfirm, onClose }) {
  if (!dialog) return null;
  if (dialog.mode === "reason") return <SupplierReasonDialog supplier={dialog.supplier} onClose={onClose} />;
  return <SupplierActionDialog supplier={dialog.supplier} mode={dialog.mode} onConfirm={onConfirm} onClose={onClose} />;
}
