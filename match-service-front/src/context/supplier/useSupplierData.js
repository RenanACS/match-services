import { useContext } from "react";
import { SupplierDataContext } from "./SupplierDataContext";

export default function useSupplierData() {
  const ctx = useContext(SupplierDataContext);
  if (!ctx) throw new Error("useSupplierData deve ser usado dentro de <SupplierDataProvider>.");
  return ctx;
}
