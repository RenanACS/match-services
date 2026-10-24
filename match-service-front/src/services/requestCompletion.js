/**
 * Contrato esperado do Django: POST /api/solicitacoes/:id/confirmar-conclusao/
 * O servidor autentica o cliente, verifica vínculo, estado do serviço,
 * pagamento capturado e retido e idempotência; só o servidor aciona o PSP.
 * VITE_API_BASE_URL habilita integração HTTP. Sem URL, é demonstração local.
 */
export const hasRequestApi = Boolean(import.meta.env.VITE_API_BASE_URL?.trim());
const demoKey = "match-service-client-completed-demo-v1";

export function readDemoCompletions() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(demoKey) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
}

export function saveDemoCompletion(requestId) {
  const saved = readDemoCompletions();
  const confirmedAt = new Date().toISOString();
  const next = { ...saved, [requestId]: confirmedAt };
  window.localStorage.setItem(demoKey, JSON.stringify(next));
  return confirmedAt;
}

export async function confirmRequestCompletion(requestId) {
  if (!hasRequestApi) throw new Error("Integração com Django ainda não configurada.");
  const base = import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, "");
  const response = await fetch(`${base}/api/solicitacoes/${encodeURIComponent(requestId)}/confirmar-conclusao/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    let message = "Não foi possível confirmar a conclusão. Tente novamente.";
    try { const body = await response.json(); message = body.detail || body.message || message; } catch { /* resposta sem JSON */ }
    throw new Error(message);
  }
  return response.json();
}
