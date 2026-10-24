import { createContext } from "react";

// Estado demonstrativo da área do fornecedor (solicitações, propostas,
// serviços, avaliações, pagamentos e perfil). Com o Django, o Provider passa
// a buscar/gravar via API (src/services/) e as telas continuam iguais.
export const SupplierDataContext = createContext(null);
