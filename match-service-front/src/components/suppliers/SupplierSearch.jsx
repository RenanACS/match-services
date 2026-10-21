import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

/**
 * Busca da tela de Fornecedores. Filtra a lista local em `suppliers.js` (por
 * nome, categoria ou serviço) ao enviar o formulário. Nenhuma chamada de rede.
 */
export default function SupplierSearch({ initialValue = "", onSearch }) {
  const [term, setTerm] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-2">
      <div className="min-w-0 flex-1">
        <Input
          id="supplier-search"
          type="search"
          aria-label="Buscar serviço ou empresa"
          enterKeyHint="search"
          appearance="app"
          leftIcon={<Icon name="search" size={16} />}
          placeholder="Buscar serviço ou empresa"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>
      <Button type="submit" variant="primary" size="md" appearance="app">
        Buscar
      </Button>
    </form>
  );
}
