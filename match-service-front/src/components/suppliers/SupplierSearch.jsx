import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { SearchIcon } from "../dashboard/icons";

/**
 * Busca da tela de Fornecedores. Ainda visual/mockada — filtra a lista
 * local em `suppliers.js` (por nome, categoria ou serviço) ao enviar o
 * formulário. Nenhuma chamada de rede acontece aqui.
 */
export default function SupplierSearch({ initialValue = "", onSearch }) {
  const [term, setTerm] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="sm:flex-1">
        <Input
          id="supplier-search"
          type="search"
          aria-label="Buscar serviço ou empresa"
          enterKeyHint="search"
          fieldSize="md"
          leftIcon={<SearchIcon />}
          placeholder="Buscar serviço ou empresa"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>
      <Button type="submit" variant="primary" size="md" className="sm:min-w-[140px]">
        Buscar
      </Button>
    </form>
  );
}
