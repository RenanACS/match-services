// Armazenamento compartilhado do fluxo "serviço concluído -> pagamento liberado".
// Fica em localStorage (e não em sessionStorage) para que fornecedor e
// cliente, em abas ou sessões diferentes, enxerguem o mesmo estado. NÃO é
// apagado pelo "Sair". Com o Django, isto vira chamadas à API (src/services/).
//
// Formato:
//   orders:        { [idDaSolicitação]: { providerDoneAt, clientConfirmedAt, paymentReleasedAt } }
//   notifications: [{ id, to, requestId, text, at, read }]

export const ENTREGA_KEY = "match-services:entrega";

// Solicitações em andamento que o cliente enxerga na demonstração. Têm o
// mesmo ID e os mesmos dados da lista do fornecedor (data/fornecedor.js).
export const DEMO_ORDER_IDS = ["2859", "2855"];

const EMPTY = Object.freeze({ orders: {}, notifications: [] });

let cacheRaw = null;
let cacheValue = EMPTY;
const listeners = new Set();

// Devolve sempre a MESMA referência enquanto o conteúdo não mudar (exigência
// do useSyncExternalStore).
export function readEntrega() {
  let raw = null;
  try {
    raw = window.localStorage.getItem(ENTREGA_KEY);
  } catch {
    return cacheValue; // storage indisponível (ou sem window): usa a cópia em memória
  }
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  try {
    const parsed = JSON.parse(raw);
    const valid = parsed && typeof parsed.orders === "object" && Array.isArray(parsed.notifications);
    cacheValue = valid ? parsed : EMPTY;
  } catch {
    cacheValue = EMPTY;
  }
  return cacheValue;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function writeEntrega(next) {
  cacheValue = next;
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(ENTREGA_KEY, raw);
    cacheRaw = raw;
  } catch {
    cacheRaw = null; // sem persistência: vale só nesta aba
  }
  notify();
}

function handleStorage(event) {
  if (event.key === ENTREGA_KEY || event.key === null) notify();
}

// Inscrição para o React. O evento "storage" dispara nas OUTRAS abas quando
// uma aba grava; nesta aba, `notify()` é chamado direto em writeEntrega.
export function subscribeEntrega(listener) {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

export function getEmptyEntrega() {
  return EMPTY;
}

function nowIso() {
  return new Date().toISOString();
}

// Fornecedor marca o serviço como concluído (aguarda o cliente confirmar).
export function markProviderDone(requestId) {
  const state = readEntrega();
  const order = state.orders[requestId];
  if (order?.providerDoneAt || order?.clientConfirmedAt) return;
  writeEntrega({
    ...state,
    orders: { ...state.orders, [requestId]: { ...order, providerDoneAt: nowIso(), clientConfirmedAt: null, paymentReleasedAt: null } },
  });
}

// Cliente confirma o serviço prestado: libera o pagamento e avisa o fornecedor.
// Vale mesmo que o fornecedor ainda não tenha avisado.
export function confirmByClient(requestId) {
  const state = readEntrega();
  const order = state.orders[requestId];
  if (order?.clientConfirmedAt) return;
  const at = nowIso();
  writeEntrega({
    orders: {
      ...state.orders,
      [requestId]: { providerDoneAt: order?.providerDoneAt ?? null, clientConfirmedAt: at, paymentReleasedAt: at },
    },
    notifications: [
      {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        to: "fornecedor",
        requestId,
        text: `Cliente confirmou o serviço #${requestId}. Pagamento liberado.`,
        at,
        read: false,
      },
      ...state.notifications,
    ],
  });
}

export function markNotificationRead(id) {
  const state = readEntrega();
  writeEntrega({
    ...state,
    notifications: state.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
  });
}

export function markAllNotificationsRead(to) {
  const state = readEntrega();
  writeEntrega({
    ...state,
    notifications: state.notifications.map((item) => (item.to === to ? { ...item, read: true } : item)),
  });
}

// Zera a demonstração (usado no Perfil do fornecedor, para repetir o teste).
export function resetEntrega() {
  writeEntrega(EMPTY);
}
