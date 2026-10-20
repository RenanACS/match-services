import { PROFILE_STORAGE_KEY } from "../data/profile";

// Campos NÃO sensíveis compartilhados entre Cadastro, Dashboard e Perfil.
// É uma lista fechada (whitelist): qualquer outra propriedade — senha,
// CPF/CNPJ etc. — é descartada antes de chegar ao sessionStorage.
export const PROFILE_FIELDS = [
  "personType",
  "name",
  "email",
  "phone",
  "cep",
  "street",
  "number",
  "complement",
  "district",
  "city",
  "state",
];

export function sanitizeProfile(data) {
  const clean = {};
  for (const key of PROFILE_FIELDS) {
    const value = data?.[key];
    clean[key] = typeof value === "string" ? value : "";
  }
  if (clean.personType !== "PF" && clean.personType !== "PJ") clean.personType = "PF";
  return clean;
}

// Devolve o cadastro da sessão ou null quando ainda não há cliente cadastrado.
export function readStoredProfile() {
  try {
    const raw = window.sessionStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return sanitizeProfile(JSON.parse(raw));
  } catch {
    // sessionStorage indisponível ou JSON inválido: sem cadastro na sessão
  }
  return null;
}

export function writeStoredProfile(profile) {
  try {
    if (profile) window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    else window.sessionStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // sem persistência: os dados valem só enquanto a aba está aberta
  }
}
