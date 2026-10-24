import { useCallback, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminClientsContext } from "./AdminClientsContext";
import { adminClients } from "../data/adminClients";

/**
 * Provider (e rota-layout) da seção Clientes do Admin. Guarda em memória os
 * bloqueios/desbloqueios feitos nesta sessão, para lista e detalhes
 * mostrarem o mesmo status. É DEMONSTRATIVO: não persiste, não chama API,
 * não bloqueia nenhuma autenticação, e não toca em solicitações, contratos,
 * pagamentos ou repasses. Recarregar a página volta ao estado inicial.
 */
export default function AdminClientsProvider() {
  // overrides[id] = { status, history } — só para clientes alterados.
  const [overrides, setOverrides] = useState({});

  const clients = useMemo(
    () => adminClients.map((client) => (overrides[client.id] ? { ...client, ...overrides[client.id] } : client)),
    [overrides],
  );

  const applyAction = useCallback((id, action, reason) => {
    setOverrides((current) => {
      const base = current[id] ?? adminClients.find((client) => client.id === id);
      if (!base) return current;
      const entry = {
        id: `${id}-h${(base.history?.length ?? 0) + 1}`,
        action,
        reason,
        date: new Date().toISOString(),
        by: "Administrador (demonstrativo)",
      };
      return {
        ...current,
        [id]: {
          status: action === "blocked" ? "blocked" : "active",
          history: [...(base.history ?? []), entry],
        },
      };
    });
  }, []);

  const blockClient = useCallback((id, reason) => applyAction(id, "blocked", reason), [applyAction]);
  const unblockClient = useCallback((id) => applyAction(id, "unblocked", ""), [applyAction]);

  const value = useMemo(
    () => ({
      clients,
      getClient: (id) => clients.find((client) => client.id === id),
      blockClient,
      unblockClient,
    }),
    [clients, blockClient, unblockClient],
  );

  return (
    <AdminClientsContext.Provider value={value}>
      <Outlet />
    </AdminClientsContext.Provider>
  );
}
