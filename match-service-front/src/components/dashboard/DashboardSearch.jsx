import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import { SearchIcon } from "./icons";
import { searchPlaceholder } from "../../data/dashboard";

/**
 * Busca principal do Dashboard. Ainda visual: não consulta nenhuma API —
 * ao enviar, apenas navega para a (futura) tela de fornecedores,
 * levando o termo em ?q= para uso posterior.
 */
export default function DashboardSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const term = query.trim();
    navigate(
      term
        ? `/app/fornecedores?q=${encodeURIComponent(term)}`
        : "/app/fornecedores",
    );
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <Input
        id="dashboard-search"
        type="search"
        aria-label="Buscar fornecedor ou serviço"
        enterKeyHint="search"
        fieldSize="md"
        leftIcon={<SearchIcon />}
        placeholder={searchPlaceholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="xl:min-h-[38px] xl:py-2"
      />
    </form>
  );
}
