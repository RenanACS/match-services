import { createContext } from "react";

// Sessão e contas simuladas (só front-end). Quando o Django existir, o
// Provider passa a chamar a API de login/cadastro/logout (src/services/) e
// quem consome (Login, Cadastro, ProtectedRoute, Sair) continua igual.
export const AuthContext = createContext(null);
