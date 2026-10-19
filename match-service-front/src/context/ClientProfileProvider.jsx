import { useCallback, useMemo, useState } from "react";
import { ClientProfileContext } from "./ClientProfileContext";
import { readStoredProfile, sanitizeProfile, writeStoredProfile } from "./clientProfileStore";

/**
 * Provider do cliente da sessão demonstrativa.
 *  - register(data): novo cadastro — SUBSTITUI tudo (nada do cadastro
 *    anterior é reaproveitado).
 *  - updateProfile(values): edição no Perfil — mescla sobre o cadastro atual.
 *  - clear(): remove o cliente da sessão (ex.: cadastro de fornecedor).
 * `profile` é null enquanto não houver cliente cadastrado.
 */
export default function ClientProfileProvider({ children }) {
  const [profile, setProfile] = useState(readStoredProfile);

  const register = useCallback((data) => {
    const clean = sanitizeProfile(data);
    writeStoredProfile(clean);
    setProfile(clean);
  }, []);

  const updateProfile = useCallback((values) => {
    setProfile((current) => {
      const clean = sanitizeProfile({ ...current, ...values });
      writeStoredProfile(clean);
      return clean;
    });
  }, []);

  const clear = useCallback(() => {
    writeStoredProfile(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ profile, register, updateProfile, clear }),
    [profile, register, updateProfile, clear],
  );

  return <ClientProfileContext.Provider value={value}>{children}</ClientProfileContext.Provider>;
}
