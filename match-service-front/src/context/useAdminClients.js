import { useContext } from "react";
import { AdminClientsContext } from "./AdminClientsContext";

export default function useAdminClients() {
  const ctx = useContext(AdminClientsContext);
  if (!ctx) throw new Error("useAdminClients deve ser usado dentro da rota /admin/clientes.");
  return ctx;
}
