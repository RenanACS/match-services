import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSuppliersContext } from "./AdminSuppliersContext";
import { adminSuppliers } from "../data/adminSuppliers";
import { HISTORY_ACTION, NEXT_STATUS, REQUIRED_STATUS } from "../services/adminSuppliers";

const STORAGE_KEY = "matchservice.admin.suppliers.v1";
const VALID_STATUS = ["review", "active", "blocked", "rejected"];

// localStorage pode lançar exceção (modo privado, dados bloqueados): sempre
// dentro de try/catch e a tela funciona normalmente sem ele.
function loadOverrides() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const clean = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (value && VALID_STATUS.includes(value.status) && Array.isArray(value.history)) clean[id] = value;
    }
    return clean;
  } catch {
    return {};
  }
}

/**
 * Provider (e rota-layout) da seção Fornecedores do Admin. Guarda as decisões
 * administrativas (aprovar, rejeitar, bloquear, desbloquear) para que lista e
 * detalhes mostrem o mesmo status, e as persiste no localStorage do navegador.
 *
 * É DEMONSTRATIVO: o localStorage NÃO é um banco de dados, não chama API, não
 * envia e-mails, não verifica documentos e não toca em contratos, pagamentos
 * ou repasses. Para voltar ao estado inicial, limpe a chave
 * "matchservice.admin.suppliers.v1" (ou os dados do site) no navegador.
 */
export default function AdminSuppliersProvider() {
  // overrides[id] = { status, history } — só para fornecedores alterados.
  const [overrides, setOverrides] = useState(loadOverrides);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      /* sem armazenamento: o estado continua valendo durante a sessão */
    }
  }, [overrides]);

  const suppliers = useMemo(
    () => adminSuppliers.map((s) => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s)),
    [overrides],
  );

  // action: "approve" | "reject" | "block" | "unblock". Ignora decisões
  // incompatíveis com o status atual (ex.: bloquear quem já está bloqueado).
  const decide = useCallback((id, action, text = "") => {
    setOverrides((current) => {
      const base = current[id] ?? adminSuppliers.find((s) => s.id === id);
      if (!base || base.status !== REQUIRED_STATUS[action]) return current;
      const history = base.history ?? [];
      const entry = {
        id: `${id}-h${history.length + 1}`,
        action: HISTORY_ACTION[action],
        reason: text.trim(),
        date: new Date().toISOString(),
        by: "Administrador (demonstrativo)",
      };
      return { ...current, [id]: { status: NEXT_STATUS[action], history: [...history, entry] } };
    });
  }, []);

  const value = useMemo(
    () => ({
      suppliers,
      getSupplier: (id) => suppliers.find((s) => s.id === id),
      decide,
    }),
    [suppliers, decide],
  );

  return (
    <AdminSuppliersContext.Provider value={value}>
      <Outlet />
    </AdminSuppliersContext.Provider>
  );
}
