import { useContext } from "react";
import { AdminSuppliersContext } from "./AdminSuppliersContext";

export default function useAdminSuppliers() {
  const ctx = useContext(AdminSuppliersContext);
  if (!ctx) throw new Error("useAdminSuppliers deve ser usado dentro da rota /admin/fornecedores.");
  return ctx;
}
