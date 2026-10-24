// Dados FICTÍCIOS das Solicitações do Admin (/admin/solicitacoes). Nada aqui é
// real. As 214 solicitações são geradas de forma determinística (sempre as
// mesmas) e batem com o Dashboard: 214 = 14 aguardando confirmação + 38 em
// andamento + 150 concluídas + 12 canceladas.
//
// Clientes e fornecedores são REFERÊNCIAS (clientId / supplierId) a registros
// de adminClients.js e adminSuppliers.js: os botões "Ver perfil" levam a
// registros que existem. Só entram clientes ativos e fornecedores ativos já
// aprovados na data da solicitação.
//
// COERÊNCIA: o estágio (stage) é derivado de eventos com data (aceite,
// pagamento, início, conclusão, cancelamento). Nenhum pagamento aparece como
// confirmado/retido/repassado sem o evento correspondente. Valores em
// centavos; comissão (10%) e repasse (90%) são calculados em
// services/adminRequests.js.
//
// Formato pensado para a futura API Django: trocar este arquivo pela resposta
// real não deve exigir mudanças nos componentes.
import { adminClients } from "./adminClients";
import { adminSuppliers } from "./adminSuppliers";

// "Agora" fixo da demonstração (evita que filtros por período mudem sozinhos).
export const DEMO_NOW = "2026-10-20T13:00:00";

const H = 3600_000;
const D = 24 * H;
const toMs = (iso) => Date.parse(iso); // sem fuso = horário local, como no resto do projeto
const iso = (ms) => {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`;
};

function makeRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const METHODS = ["Cartão de crédito", "Pix", "Cartão de débito"];
const CANCEL_REASONS = {
  client: ["Cliente desistiu da contratação.", "Cliente encontrou outra solução.", "Mudança de planos do cliente."],
  supplier: ["Fornecedor sem disponibilidade na data pedida.", "Fornecedor não atende a região informada."],
};
const DISPUTE_REASONS = [
  "Cliente informa que o serviço não foi entregue conforme combinado.",
  "Divergência sobre o acabamento do serviço executado.",
];

// Quantidades por estágio (somam 214 e batem com o Dashboard).
const PLAN = [
  ["awaiting_acceptance", 8], ["awaiting_payment", 6], // 14 aguardando confirmação
  ["paid", 8], ["in_progress", 30], // 38 em andamento
  ["completed_pending", 8], ["completed_processing", 7], ["completed_held", 5], ["completed_done", 130], // 150 concluídas
  ["cancelled_client", 7], ["cancelled_supplier", 5], // 12 canceladas
];

function buildRequests() {
  const rand = makeRandom(20261020);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const between = (min, max) => min + rand() * (max - min);

  // --- 1) ordem cronológica dos estágios (mais recente → mais antigo) --------
  const shuffle = (list) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  // Os 4 primeiros (#2847..#2844) reproduzem a tela de referência e ficam fora do sorteio.
  const fixedStages = ["awaiting_acceptance", "in_progress", "completed_pending", "cancelled_client"];
  const pool = PLAN.flatMap(([stage, count]) => Array(count).fill(stage));
  for (const stage of fixedStages) pool.splice(pool.indexOf(stage), 1);

  const ACTIVE = ["awaiting_acceptance", "awaiting_payment", "paid", "in_progress"];
  const active = pool.filter((s) => ACTIVE.includes(s));
  const others = pool.filter((s) => !ACTIVE.includes(s));
  const isRecentCompleted = (s) => ["completed_pending", "completed_processing", "completed_held"].includes(s);
  const cancelled = others.filter((s) => s.startsWith("cancelled"));
  // Bloco recente: aguardando/andamento + concluídas ainda com repasse em aberto + algumas canceladas.
  const recentBlock = shuffle([...active, ...others.filter(isRecentCompleted), ...cancelled.slice(0, 4)]);
  const olderBlock = shuffle([...others.filter((s) => s === "completed_done"), ...cancelled.slice(4)]);
  const stages = [...recentBlock, ...olderBlock];

  // --- 2) eventos de cada solicitação -----------------------------------------
  const CAP = toMs("2026-10-15T20:00:00");
  const NOW = toMs(DEMO_NOW);
  const items = stages.map((stage, k) => {
    const spacing = k < recentBlock.length ? 0.5 * D : 1.1 * D;
    const created0 =
      k < recentBlock.length
        ? CAP - k * spacing
        : CAP - recentBlock.length * 0.5 * D - (k - recentBlock.length) * spacing;
    return buildEvents(stage, created0 - between(0, 5) * H, { rand, between, pick, NOW });
  });

  // curados (idênticos à referência: #2847, #2846, #2845, #2844)
  const curated = [
    { stage: "awaiting_acceptance", createdAt: "2026-10-19T14:32:00", valueCents: 250000, method: "Cartão de crédito", detail: "Final 1234" },
    { stage: "in_progress", createdAt: "2026-10-18T10:15:00", acceptedAt: "2026-10-18T11:40:00", paidAt: "2026-10-18T11:55:00", startedAt: "2026-10-19T08:30:00", valueCents: 80000, method: "Pix" },
    { stage: "completed_pending", createdAt: "2026-10-17T16:48:00", acceptedAt: "2026-10-17T17:30:00", paidAt: "2026-10-17T17:45:00", startedAt: "2026-10-18T09:00:00", completedAt: "2026-10-19T18:00:00", valueCents: 60000, method: "Cartão de crédito", detail: "Final 5678" },
    { stage: "cancelled_client", createdAt: "2026-10-16T09:22:00", cancelledAt: "2026-10-16T15:00:00", valueCents: 45000 },
  ].map((c) => ({ ...c, curated: true }));

  const all = [
    ...curated,
    ...items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  ];

  // --- 3) clientes, fornecedores, serviços e identificadores ---------------------
  const activeClients = adminClients.filter((c) => c.status === "active");
  const activeSuppliers = adminSuppliers
    .filter((s) => s.status === "active")
    .map((s) => ({ supplier: s, since: toMs(s.history.find((h) => h.action === "approved")?.date ?? s.registeredAt) }));

  return all.map((r, index) => {
    const createdMs = toMs(r.createdAt);
    const suppliers = activeSuppliers.filter((x) => x.since <= createdMs - D);
    const supplier = (suppliers.length ? pick(suppliers) : pick(activeSuppliers)).supplier;
    const clients = activeClients.filter((c) => toMs(`${c.registeredAt}T12:00:00`) <= createdMs - D);
    const client = pick(clients.length ? clients : activeClients);
    const service = pick(supplier.services.filter((s) => !s.paused).length ? supplier.services.filter((s) => !s.paused) : supplier.services);
    const valueCents = r.valueCents ?? service.priceCents ?? Math.round(between(30000, 300000) / 1000) * 1000;
    const id = String(2847 - index);
    return {
      id,
      stage: r.stage,
      clientId: client.id,
      supplierId: supplier.id,
      service: { name: service.name, category: service.category, description: service.description },
      location: { city: client.address.city, state: client.address.state },
      valueCents,
      createdAt: r.createdAt,
      acceptedAt: r.acceptedAt ?? null,
      paidAt: r.paidAt ?? null,
      startedAt: r.startedAt ?? null,
      completedAt: r.completedAt ?? null,
      cancellation: r.cancelledAt
        ? { at: r.cancelledAt, by: r.stage === "cancelled_supplier" ? "supplier" : "client", reason: pick(CANCEL_REASONS[r.stage === "cancelled_supplier" ? "supplier" : "client"]) }
        : null,
      // pagamento: método (escolhido ou usado) e identificação do cartão; sem
      // paidAt o pagamento NÃO foi confirmado.
      payment: { method: r.method ?? null, detail: r.detail ?? null },
      // repasse: só existe evento de repasse concluído se payoutAt existir.
      payout: { status: payoutStatus(r.stage), at: r.payoutAt ?? null },
      dispute: r.stage === "completed_held" ? { openedAt: iso(toMs(r.completedAt) + 1 * D), reason: pick(DISPUTE_REASONS) } : null,
    };
  });
}

function payoutStatus(stage) {
  if (stage === "completed_pending") return "pending";
  if (stage === "completed_processing") return "processing";
  if (stage === "completed_held") return "held";
  if (stage === "completed_done") return "done";
  if (stage === "paid" || stage === "in_progress") return "not_due";
  return "none";
}

// Gera os eventos de um estágio, empurrando tudo para o passado se algum
// evento cair depois de "agora".
function buildEvents(stage, created0, { rand, between, pick, NOW }) {
  const out = { stage, method: null, detail: null };
  let created = created0;
  const chain = [];
  const accepted = created + between(2, 20) * H;
  const paid = accepted + between(0.5, 6) * H;
  const started = paid + between(0.5, 2.5) * D;
  const completed = started + between(2, 9) * D;
  const payout = completed + between(1.5, 4) * D;

  if (stage === "awaiting_acceptance") {
    chain.push(created);
  } else if (stage === "awaiting_payment") chain.push(accepted);
  else if (stage === "paid") chain.push(paid);
  else if (stage === "in_progress") chain.push(started);
  else if (stage === "completed_pending" || stage === "completed_held") chain.push(completed + (stage === "completed_held" ? 1 * D : 0));
  else if (stage === "completed_processing") chain.push(completed);
  else if (stage === "completed_done") chain.push(payout);
  else chain.push(created + 1 * D);

  const overflow = Math.max(0, Math.max(...chain) - (NOW - 2 * H));
  created -= overflow;
  const shift = (ms) => iso(ms - overflow);

  out.createdAt = iso(created);
  const methodChosen = pick(METHODS);
  const cardTail = String(1000 + Math.floor(rand() * 9000));
  const useCard = methodChosen.startsWith("Cartão");
  const needsAccept = !["awaiting_acceptance", "cancelled_client", "cancelled_supplier"].includes(stage);
  if (needsAccept) out.acceptedAt = shift(accepted);
  if (["paid", "in_progress"].includes(stage) || stage.startsWith("completed")) {
    out.paidAt = shift(paid);
    out.method = methodChosen;
    out.detail = useCard ? `Final ${cardTail}` : null;
  }
  if (stage === "in_progress" || stage.startsWith("completed")) out.startedAt = shift(started);
  if (stage.startsWith("completed")) out.completedAt = shift(completed);
  if (stage === "completed_done") out.payoutAt = shift(payout);
  if (stage === "awaiting_payment" && rand() < 0.5) {
    out.method = methodChosen; // método já escolhido, mas NÃO pago
    out.detail = useCard ? `Final ${cardTail}` : null;
  }
  if (stage === "awaiting_acceptance" && rand() < 0.4) {
    out.method = methodChosen;
    out.detail = useCard ? `Final ${cardTail}` : null;
  }
  if (stage.startsWith("cancelled")) out.cancelledAt = shift(created + 1 * D);
  return out;
}

export const adminRequests = buildRequests();
