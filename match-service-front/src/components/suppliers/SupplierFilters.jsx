import Select from "../ui/Select";

/**
 * Três filtros previstos para o MVP: categoria, localização e avaliação.
 * Operam sobre os dados mockados em `suppliers.js` — sem consulta a API.
 */
export default function SupplierFilters({
  category,
  location,
  minRating,
  categories,
  locations,
  ratingOptions,
  onCategoryChange,
  onLocationChange,
  onRatingChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="sm:flex-1">
        <Select
          id="supplier-filter-category"
          aria-label="Categoria"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">Categoria</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="sm:flex-1">
        <Select
          id="supplier-filter-location"
          aria-label="Localização"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
        >
          <option value="">Localização</option>
          {locations.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="sm:flex-1">
        <Select
          id="supplier-filter-rating"
          aria-label="Avaliação"
          value={minRating}
          onChange={(event) => onRatingChange(event.target.value)}
        >
          <option value="">Avaliação</option>
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
