import ClientLayout from "./ClientLayout";
import SupplierLayout from "./SupplierLayout";

/**
 * Ponto de entrada dos layouts autenticados (/app/* e /fornecedor/*). Cada
 * área tem o seu próprio layout, isolado: o cliente usa o ClientLayout (padrão
 * visual do Admin) e o fornecedor continua com o layout original.
 */
export default function AppLayout({ area = "client" }) {
  return area === "fornecedor" ? <SupplierLayout area="fornecedor" /> : <ClientLayout />;
}
