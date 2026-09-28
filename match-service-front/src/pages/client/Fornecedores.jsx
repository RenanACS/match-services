import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SupplierSearch from "../../components/suppliers/SupplierSearch";
import SupplierFilters from "../../components/suppliers/SupplierFilters";
import SupplierList from "../../components/suppliers/SupplierList";
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

  const listToShow = filtersActive ? filteredSuppliers : topRated;
  const heading = filtersActive ? "Resultados da busca" : "Fornecedores mais bem avaliados";
  const count = filtersActive ? filteredSuppliers.length : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl xl:text-2xl">
          Fornecedores
        </h1>
        <p className="mt-2 max-w-xl text-base text-cream/60 xl:mt-1 xl:text-sm">
          Pesquise empresas por serviço, categoria ou nome.
        </p>
      </header>

      <SupplierSearch initialValue={query} onSearch={setQuery} />

      <SupplierFilters
        category={category}
        location={location}
        minRating={minRating}
        categories={supplierCategories}
        locations={supplierLocations}
        ratingOptions={supplierRatingOptions}
        onCategoryChange={setCategory}
        onLocationChange={setLocation}
        onRatingChange={setMinRating}
      />

      <SupplierList heading={heading} count={count} suppliers={listToShow} />
    </div>
  );
}
