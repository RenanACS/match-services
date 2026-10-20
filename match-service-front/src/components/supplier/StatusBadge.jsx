import { SUPPLIER_REQUEST_STATUS } from "../../data/fornecedor";
import ToneBadge from "./ToneBadge";

/** Status da solicitação com ícone, como na referência visual. */
export default function StatusBadge({ status }) {
  const { label, tone } = SUPPLIER_REQUEST_STATUS[status];
  return <ToneBadge tone={tone} label={label} withIcon />;
}
