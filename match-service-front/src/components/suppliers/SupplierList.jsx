import SupplierCard from "./SupplierCard";
import Pagination from "../ui/Pagination";
import SectionTitle from "../ui/SectionTitle";

/**
 * Lista/grid de fornecedores (catálogo em cartões, não tabela). `count`
 * diferencia os dois estados: null = catálogo inicial ("Fornecedores mais bem
 * avaliados", sem contagem); número = resultado de busca/filtro. Com busca ou
 * filtro ativos os resultados são paginados de 3 em 3 (`pagination`).
 */
export default function SupplierList({ heading, count, suppliers, pagination }) {
  return (
    <section aria-labelledby="supplier-list-title">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <SectionTitle id="supplier-list-title">{heading}</SectionTitle>
        {count !== null && (
          <span className="app-small shrink-0 text-cream/70">
            {count} {count === 1 ? "fornecedor encontrado" : "fornecedores encontrados"}
          </span>
        )}
      </div>

      {suppliers.length === 0 ? (
        <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-8 text-center">
          <p className="app-text text-cream/70">Nenhum fornecedor encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-3 rounded-[20px] border border-hairline bg-surface-1">
              <Pagination {...pagination} itemLabel="fornecedores" />
            </div>
          )}
        </>
      )}
    </section>
  );
}
