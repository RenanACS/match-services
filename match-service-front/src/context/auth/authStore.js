// Persistência demonstrativa da sessão e das contas (sessionStorage: dura
// só a aba). Nunca guarda senha, CPF ou CNPJ — apenas os campos abaixo.

export const SESSION_KEY = "match-services:session";
export const ACCOUNTS_KEY = "match-services:accounts";

export const ROLES = ["cliente", "fornecedor"];

// Lista fechada: qualquer outra propriedade é descartada antes de gravar.
const ACCOUNT_FIELDS = ["role", "email", "name", "phone", "category", "address"];

export function sanitizeAccount(data) {
  const clean = {};
  for (const key of ACCOUNT_FIELDS) {
    const value = data?.[key];
    clean[key] = typeof value === "string" ? value.trim() : "";
  }
  clean.email = clean.email.toLowerCase();
  if (!ROLES.includes(clean.role)) clean.role = "cliente";
  return clean;
}

function readJson(key) {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // storage indisponível ou JSON inválido
  }
}

function writeJson(key, value) {
  try {
    if (value) window.sessionStorage.setItem(key, JSON.stringify(value));
    else window.sessionStorage.removeItem(key);
  } catch {
    // sem persistência: vale só enquanto a aba estiver aberta
  }
}

export function readSession() {
  const stored = readJson(SESSION_KEY);
  return stored && typeof stored === "object" ? sanitizeAccount(stored) : null;
}

export function writeSession(session) {
  writeJson(SESSION_KEY, session);
}

export function readAccounts() {
  const stored = readJson(ACCOUNTS_KEY);
  return Array.isArray(stored) ? stored.map(sanitizeAccount) : [];
}

export function writeAccounts(accounts) {
  writeJson(ACCOUNTS_KEY, accounts);
}

// Página inicial de cada papel.
export function homeForRole(role) {
  return role === "fornecedor" ? "/fornecedor" : "/app";
}
