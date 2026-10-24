import { Link } from "react-router-dom";
import Icon from "../AdminIcons";

/** Só o ícone de olho → detalhes da contestação. */
export function DisputeViewLink({ dispute, state }) {
  return (
    <Link
      to={`/admin/contestacoes/${dispute.id}`}
      state={state}
      aria-label={`Ver detalhes da contestação #${dispute.id}`}
      title="Ver detalhes"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-cream/80 transition hover:border-orange/60 hover:text-cream"
    >
      <Icon name="eye" size={18} />
    </Link>
  );
}
