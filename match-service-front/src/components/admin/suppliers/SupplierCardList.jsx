import { useLocation } from "react-router-dom";
import { SupplierAvatar, SupplierStatusBadge } from "./SupplierBadges";
import SupplierRowActions, { SupplierDetailsLink } from "./SupplierRowActions";
import { formatDate } from "../../../utils/dates";

/** Lista em cartões para telas menores que xl (no lugar da tabela). */
export default function SupplierCardList({ suppliers, onAction }) {
  const { search } = useLocation();
  const linkState = { fromSearch: search };
  return (
    <ul className="divide-y divide-hairline">
      {suppliers.map((supplier) => (
        <li key={supplier.id} className="flex flex-col gap-3 p-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SupplierAvatar name={supplier.name} />
              <div className="min-w-0">
                <p className="truncate font-medium text-cream">{supplier.name}</p>
                <p className="truncate adm-small text-cream/60">{supplier.email}</p>
              </div>
            </div>
            <SupplierStatusBadge status={supplier.status} />
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 adm-text">
            <div>
              <dt className="adm-small text-cream/50">CNPJ</dt>
              <dd className="text-cream/80">{supplier.cnpj}</dd>
            </div>
            <div>
              <dt className="adm-small text-cream/50">Categoria</dt>
              <dd className="text-cream/80">{supplier.category}</dd>
            </div>
            <div>
              <dt className="adm-small text-cream/50">Cadastro em</dt>
              <dd className="text-cream/80">{formatDate(supplier.registeredAt)}</dd>
            </div>
          </dl>
          <div className="flex items-center gap-4">
            <SupplierDetailsLink supplier={supplier} state={linkState} />
            <SupplierRowActions supplier={supplier} onAction={onAction} />
          </div>
        </li>
      ))}
    </ul>
  );
}
