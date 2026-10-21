import { useContext } from "react";
import { AdminDisputesContext } from "./AdminDisputesContext";

export default function useAdminDisputes() {
  const ctx = useContext(AdminDisputesContext);
  if (!ctx) throw new Error("useAdminDisputes deve ser usado dentro da rota /admin/contestacoes.");
  return ctx;
}
