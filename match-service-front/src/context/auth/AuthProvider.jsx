import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  readAccounts,
  readSession,
  sanitizeAccount,
  writeAccounts,
  writeSession,
} from "./authStore";

/**
 * Provider da sessão (simulada).
 *  - signUp(data): cria/atualiza a conta (por e-mail) e já abre a sessão.
 *  - signIn({ email, role }): se o e-mail tem conta, usa o papel DA CONTA;
 *    senão entra com o papel escolhido no toggle (para a demonstração).
 *  - signOut(): limpa a sessão. As contas simuladas permanecem para o
 *    próximo login; para rotas protegidas, `session` é a única fonte.
 * `session` é null enquanto ninguém estiver logado.
 */
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const signUp = useCallback((data) => {
    const account = sanitizeAccount(data);
    const others = readAccounts().filter((item) => item.email !== account.email);
    writeAccounts([...others, account]);
    writeSession(account);
    setSession(account);
    return account;
  }, []);

  const signIn = useCallback(({ email, role }) => {
    const normalized = email.trim().toLowerCase();
    const existing = readAccounts().find((item) => item.email === normalized);
    const account = existing ?? sanitizeAccount({ email: normalized, role });
    writeSession(account);
    setSession(account);
    return account;
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, role: session?.role ?? null, signUp, signIn, signOut }),
    [session, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
