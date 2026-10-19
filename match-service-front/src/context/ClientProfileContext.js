import { createContext } from "react";

// Fonte única (demonstrativa) dos dados do cliente. Quando o Django existir,
// o Provider passa a buscar/atualizar via API (src/services/) e Cadastro,
// Dashboard e Perfil continuam consumindo o mesmo contrato.
export const ClientProfileContext = createContext(null);
