import { useContext } from "react";
import { ClientProfileContext } from "./ClientProfileContext";

export default function useClientProfile() {
  const ctx = useContext(ClientProfileContext);
  if (!ctx) throw new Error("useClientProfile deve ser usado dentro de <ClientProfileProvider>.");
  return ctx;
}
