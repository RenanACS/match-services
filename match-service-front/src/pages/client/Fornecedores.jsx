import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SupplierSearch from "../../components/suppliers/SupplierSearch";
import SupplierFilters from "../../components/suppliers/SupplierFilters";
import SupplierList from "../../components/suppliers/SupplierList";
import { paginate, PAGE_SIZE } from "../../utils/paginate";
import {
  suppliers,
  supplierCategories,
  supplierLocations,
  supplierRatingOptions,
} from "../../data/suppliers";

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Hub de fornecedores (/app/fornecedores).
 * Dados 100% mockados em src/data/suppliers.js — busca e filtros rodam
 * inteiramente no front-end, sem chamada de rede. Quando não há nenhuma
 * busca/filtro ativo, mostra os 3 fornecedores mais bem avaliados; assim
 * que o cliente pesquisa ou filtra, a seção vira "Resultados da busca"
 * com a contagem encontrada (ou o estado vazio).
 */
export default function Fornecedores() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);

  // Qualquer mudança de busca/filtro volta para a primeira página.
  const withReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const filtersActive = Boolean(query || category || location || minRating);

  const filteredSuppliers = useMemo(() => {
    const term = normalize(query.trim());
    return suppliers.filter((supplier) => {
      const matchesQuery =
        !term ||
        normalize(supplier.name).includes(term) ||
        normalize(supplier.category).includes(term) ||
        supplier.tags.some((tag) => normalize(tag).includes(term));
      const matchesCategory = !category || supplier.category === category;
      const matchesLocation = !location || supplier.location === location;
      const matchesRating = !minRating || supplier.rating >= Number(minRating);
      return matchesQuery && matchesCategory && matchesLocation && matchesRating;
    });
  }, [query, category, location, minRating]);

  const topRated = useMemo(
    () => [...suppliers].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [],
  );

  const pageData = paginate(filteredSuppliers, page);
  const listToShow = filtersActive ? pageData.items : topRated;
  const heading = filtersActive ? "Resultados da busca" : "Fornecedores mais bem avaliados";
  const count = filtersActive ? filteredSuppliers.length : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3.5">
      <h1 className="app-page-title text-cream">Fornecedores</h1>

      <div className="flex flex-col gap-2 rounded-2xl border border-hairline bg-surface-1/60 p-3 xl:flex-row xl:items-center xl:gap-3">
        <div className="xl:flex-1">
          <SupplierSearch initialValue={query} onSearch={withReset(setQuery)} />
        </div>
        <SupplierFilters
          category={category}
          location={location}
          minRating={minRating}
          categories={supplierCategories}
          locations={supplierLocations}
          ratingOptions={supplierRatingOptions}
          onCategoryChange={withReset(setCategory)}
          onLocationChange={withReset(setLocation)}
          onRatingChange={withReset(setMinRating)}
        />
      </div>

      <SupplierList
        heading={heading}
        count={count}
        suppliers={listToShow}
        pagination={
          filtersActive
            ? { page: pageData.page, totalPages: pageData.totalPages, total: pageData.total, start: pageData.start, pageSize: PAGE_SIZE, onPageChange: setPage }
            : null
        }
      />
    </div>
  );
}
