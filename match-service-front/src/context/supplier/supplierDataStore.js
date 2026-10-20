import {
  supplierPayments,
  supplierProposals,
  supplierRequests,
  supplierReviews,
  supplierServices,
} from "../../data/fornecedor";

// Persistência demonstrativa (sessionStorage: dura só a aba). Não guarda
// senha nem CNPJ. É apagada no logout (ver SupplierLayout).
export const SUPPLIER_DATA_KEY = "match-services:supplier-data";

const COLLECTIONS = ["requests", "proposals", "services", "reviews", "payments"];

// Estado inicial: mocks + perfil montado com os dados do cadastro/sessão.
export function createSeed(session) {
  return structuredClone({
    requests: supplierRequests,
    proposals: supplierProposals,
    services: supplierServices,
    reviews: supplierReviews,
    payments: supplierPayments,
    profile: {
      name: session?.name ?? "",
      email: session?.email ?? "",
      phone: session?.phone ?? "",
      address: session?.address ?? "",
      category: session?.category ?? "",
      about: "",
    },
  });
}

export function readSupplierData() {
  try {
    const raw = window.sessionStorage.getItem(SUPPLIER_DATA_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const valid =
      data && typeof data.profile === "object" && COLLECTIONS.every((key) => Array.isArray(data[key]));
    return valid ? data : null;
  } catch {
    return null; // storage indisponível ou JSON inválido
  }
}

export function writeSupplierData(data) {
  try {
    window.sessionStorage.setItem(SUPPLIER_DATA_KEY, JSON.stringify(data));
  } catch {
    // sem persistência: vale só enquanto a aba estiver aberta
  }
}

export function clearSupplierData() {
  try {
    window.sessionStorage.removeItem(SUPPLIER_DATA_KEY);
  } catch {
    // nada a limpar
  }
}
