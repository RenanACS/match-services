import { useLocation } from "react-router-dom";
import { SupplierAvatar, SupplierStatusBadge } from "./SupplierBadges";
import SupplierRowActions, { SupplierDetailsLink } from "./SupplierRowActions";
import { formatDate } from "../../../utils/dates";

/**
 * Tabela (a partir de xl): Empresa | CNPJ | Categoria | Status | Cadastro em |
 * Ações (Detalhes + "..."). Colunas em porcentagem (table-fixed): ocupa a
 * largura disponível, sem largura mínima e sem rolagem interna; textos longos
 * são truncados (o texto completo fica no title).
 */
export default function SuppliersTable({ suppliers, onAction }) {
  const { search } = useLocation();
  const linkState = { fromSearch: search };
  const th = "px-3 py-3 adm-text font-medium text-cream/70 xl:py-2.5";
  const td = "px-3 py-3 xl:py-[9px]";
  return (
    <table className="w-full table-fixed text-left adm-text">
      <colgroup>
        <col className="w-[29%]" />
        <col className="w-[17%]" />
        <col className="w-[13%]" />
        <col className="w-[13%]" />
        <col className="w-[12%]" />
        <col className="w-[16%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className={`${th} pl-6`}>Empresa</th>
          <th scope="col" className={th}>CNPJ</th>
          <th scope="col" className={th}>Categoria</th>
          <th scope="col" className={th}>Status</th>
          <th scope="col" className={th}>Cadastro em</th>
          <th scope="col" className={`${th} pr-6`}>Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {suppliers.map((supplier) => (
          <tr key={supplier.id} className="transition hover:bg-surface-2/60">
            <td className="py-3 pl-6 pr-3 xl:py-[9px]">
              <div className="flex min-w-0 items-center gap-3">
                <SupplierAvatar name={supplier.name} />
                <div className="min-w-0">
                  <p title={supplier.name} className="truncate font-medium text-cream">{supplier.name}</p>
                  <p title={supplier.email} className="truncate adm-small text-cream/70">{supplier.email}</p>
                </div>
              </div>
            </td>
            <td className={`${td} truncate text-cream/80`}>{supplier.cnpj}</td>
            <td className={`${td} truncate text-cream/80`}>{supplier.category}</td>
            <td className={td}><SupplierStatusBadge status={supplier.status} /></td>
            <td className={`${td} text-cream/80`}>{formatDate(supplier.registeredAt)}</td>
            <td className="py-3 pl-3 pr-6 xl:py-[9px]">
              <div className="flex items-center gap-3">
                <SupplierDetailsLink supplier={supplier} state={linkState} />
                <SupplierRowActions supplier={supplier} onAction={onAction} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
