import SupplierCard from "./SupplierCard";

/**
 * Lista/grid de fornecedores. `count` diferencia os dois estados pedidos:
 * null = catálogo inicial ("Fornecedores mais bem avaliados", sem contagem);
 * número = resultado de busca/filtro ("Resultados da busca", com contagem).
 */
export default function SupplierList({ heading, count, suppliers }) {
  return (
    <section aria-labelledby="supplier-list-title">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2
          id="supplier-list-title"
          className="font-display text-xl font-semibold text-cream xl:text-base"
        >
          {heading}
        </h2>
        {count !== null && (
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-cream/50">
            {count} {count === 1 ? "fornecedor encontrado" : "fornecedores encontrados"}
          </span>
        )}
      </div>

      {suppliers.length === 0 ? (
        <div className="rounded-[20px] border border-hairline bg-surface-1 px-6 py-10 text-center">
          <p className="text-sm text-cream/60">Nenhum fornecedor encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}
    </section>
  );
}
