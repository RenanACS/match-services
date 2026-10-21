// Dados FICTÍCIOS das Contestações do Admin (/admin/contestacoes). Nada aqui é
// real. Cada contestação aponta para uma SOLICITAÇÃO existente (requestId), e
// cliente e fornecedor são os dessa solicitação, então os links levam a
// registros que existem.
//
// COERÊNCIA com Solicitações e Pagamentos:
//  - as 5 solicitações concluídas com repasse "retido por contestação"
//    (stage completed_held, as mesmas do Dashboard: 5 contestações abertas)
//    têm 1 contestação cada, ainda sem decisão (3 abertas + 2 em análise);
//  - 19 solicitações concluídas COM repasse já concluído têm contestação
//    resolvida ANTES do repasse (abertura e decisão anteriores à data do repasse);
//  - o texto da descrição das 5 primeiras é o mesmo já registrado na solicitação.
// Uma decisão administrativa NÃO altera pagamento nem repasse: isso é feito
// (no futuro) pelo backend/provedor financeiro. Os anexos são DEMONSTRATIVOS
// (só nomes, sem arquivo e sem download).
import { adminRequests, DEMO_NOW } from "./adminRequests";

export const DISPUTE_REASONS = {
  not_done: "Serviço não realizado",
  unsatisfactory: "Serviço realizado de forma insatisfatória",
  breach: "Descumprimento do combinado",
  payment: "Problema com pagamento",
  cancel_refund: "Cancelamento ou reembolso",
  other: "Outro motivo",
};

export const DISPUTE_DECISIONS = {
  favor_client: "Favorável ao cliente",
  favor_supplier: "Favorável ao fornecedor",
  agreement: "Acordo entre as partes",
  dismissed: "Improcedente (sem ação)",
};

export const ADMIN_ACTOR = "Administrador (demonstrativo)";

const H = 3600_000;
const toMs = (iso) => Date.parse(iso);
const iso = (ms) => {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`;
};

// Textos por motivo: descrição do problema, relato do reclamante e resposta da outra parte.
const TEXTS = {
  not_done: [
    { problem: "O serviço contratado não foi realizado na data combinada.", claim: "Aguardei a equipe durante todo o dia combinado e ninguém compareceu. Tentei contato pela plataforma e não obtive retorno.", response: "Houve um imprevisto com a equipe e tentamos reagendar, mas o cliente não confirmou a nova data." },
    { problem: "A equipe esteve no local, mas não concluiu o serviço.", claim: "A equipe esteve no local por pouco tempo e saiu sem terminar. O serviço foi marcado como concluído mesmo assim.", response: "O serviço foi executado conforme o escopo e o local estava liberado para a conclusão." },
  ],
  unsatisfactory: [
    { problem: "Divergência sobre o acabamento do serviço executado.", claim: "O acabamento ficou diferente do combinado e há partes que precisam ser refeitas.", response: "O serviço seguiu o escopo aprovado. Nos colocamos à disposição para ajustes pontuais." },
    { problem: "O resultado do serviço não atendeu ao esperado.", claim: "Parte do serviço apresentou falhas poucos dias depois da entrega e o fornecedor demorou a responder.", response: "As falhas decorrem de uso posterior ao serviço. Oferecemos uma visita técnica sem custo." },
  ],
  breach: [
    { problem: "Cliente informa que o serviço não foi entregue conforme combinado.", claim: "O prazo e os itens acordados não foram cumpridos. Parte do escopo ficou de fora.", response: "O escopo foi cumprido conforme o orçamento aceito e os itens extras exigiriam novo orçamento." },
    { problem: "Descumprimento de prazo e de itens do orçamento aceito.", claim: "O serviço atrasou além do prazo informado e itens previstos não foram entregues.", response: "O atraso ocorreu por indisponibilidade de material, informada ao cliente durante o serviço." },
  ],
  payment: [
    { problem: "Dúvida sobre o valor cobrado do cliente.", claim: "O valor cobrado é diferente do orçamento aceito na solicitação.", response: "O valor cobrado é o do orçamento aceito; não houve acréscimo pelo fornecedor." },
  ],
  cancel_refund: [
    { problem: "Pedido de cancelamento com devolução do valor.", claim: "Solicitei o cancelamento antes do início do serviço e quero o valor de volta.", response: "O cancelamento foi pedido depois da reserva da equipe e do material para a data combinada." },
  ],
  other: [
    { problem: "Conflito sobre a comunicação durante o serviço.", claim: "Houve desentendimento sobre mudanças no serviço e as combinações ficaram sem registro.", response: "As mudanças foram combinadas verbalmente e aceitas na hora pelo cliente." },
  ],
};

const DECISION_TEXTS = {
  favor_supplier: [
    "Evidências indicam que o serviço foi executado conforme o escopo aceito.",
    "O fornecedor comprovou a execução do combinado e a contestação não se sustenta.",
  ],
  agreement: ["As partes chegaram a um acordo sobre ajustes pontuais no serviço."],
  dismissed: ["Sem elementos suficientes para dar procedência à contestação. Caso encerrado sem ação."],
  favor_client: ["As evidências apresentadas confirmam o descumprimento do combinado."],
};

const ATTACHMENTS = [
  [{ name: "foto-servico-1.jpg", kind: "Imagem" }, { name: "foto-servico-2.jpg", kind: "Imagem" }],
  [{ name: "conversa-plataforma.pdf", kind: "PDF" }],
  [{ name: "orcamento-aceito.pdf", kind: "PDF" }, { name: "foto-local.jpg", kind: "Imagem" }],
  [],
];

const REASON_KEYS = Object.keys(DISPUTE_REASONS);

function build() {
  const NOW = toMs(DEMO_NOW);

  // --- contestações ainda sem decisão: as solicitações com repasse retido -------
  const held = adminRequests
    .filter((r) => r.dispute)
    .sort((a, b) => b.dispute.openedAt.localeCompare(a.dispute.openedAt));
  const heldStatus = ["open", "open", "analysis", "analysis", "open"];

  // --- contestações resolvidas: concluídas com repasse feito DEPOIS da decisão --
  const candidates = adminRequests.filter(
    (r) => r.stage === "completed_done" && r.payout.at && toMs(r.payout.at) - toMs(r.completedAt) >= 30 * H,
  );
  const stride = Math.max(1, Math.floor(candidates.length / 19));
  const resolvedRequests = candidates.filter((_, i) => i % stride === 0).slice(0, 19);

  const rows = [];

  held.forEach((request, index) => {
    const reason = request.dispute.reason.includes("acabamento") ? "unsatisfactory" : "breach";
    const status = heldStatus[index] ?? "open";
    const text = (TEXTS[reason].find((t) => t.problem === request.dispute.reason) ?? TEXTS[reason][0]);
    const openedAt = request.dispute.openedAt;
    const history = [{ type: "opened", at: openedAt, by: "Cliente", text: "Contestação aberta pelo cliente." }];
    const notes = [];
    if (status === "analysis") {
      const takenAt = iso(Math.min(toMs(openedAt) + (3 + index) * H, NOW - H));
      history.push({ type: "taken", at: takenAt, by: ADMIN_ACTOR, text: "Análise assumida." });
      if (index === 3) {
        const at = iso(Math.min(toMs(takenAt) + 2 * H, NOW - 30 * 60_000));
        notes.push({ at, by: ADMIN_ACTOR, text: "Solicitado às partes o envio de evidências do combinado." });
        history.push({ type: "note", at, by: ADMIN_ACTOR, text: "Observação interna registrada." });
      }
    }
    rows.push({
      requestId: request.id, clientId: request.clientId, supplierId: request.supplierId,
      openedAt, reason, status, claimant: "client", problem: request.dispute.reason,
      claim: text.claim, response: index % 2 === 0 ? text.response : null,
      attachments: ATTACHMENTS[index % ATTACHMENTS.length], history, notes, decision: null,
    });
  });

  resolvedRequests.forEach((request, index) => {
    const reason = REASON_KEYS[(index * 5 + 1) % REASON_KEYS.length];
    const variants = TEXTS[reason];
    const text = variants[index % variants.length];
    const completedMs = toMs(request.completedAt);
    const payoutMs = toMs(request.payout.at);
    const openedMs = completedMs + (2 + (index % 5)) * H;
    const takenMs = openedMs + (1 + (index % 3)) * H;
    const resolvedMs = Math.min(takenMs + (6 + (index % 9)) * H, payoutMs - 2 * H);
    const decisionKey = ["favor_supplier", "favor_supplier", "agreement", "dismissed"][index % 4];
    const justification = DECISION_TEXTS[decisionKey][index % DECISION_TEXTS[decisionKey].length];
    const claimant = reason === "breach" && index % 2 === 1 ? "supplier" : "client";
    const history = [
      { type: "opened", at: iso(openedMs), by: claimant === "client" ? "Cliente" : "Fornecedor", text: `Contestação aberta pelo ${claimant === "client" ? "cliente" : "fornecedor"}.` },
      { type: "taken", at: iso(takenMs), by: ADMIN_ACTOR, text: "Análise assumida." },
      { type: "decision", at: iso(resolvedMs), by: ADMIN_ACTOR, text: `Decisão registrada: ${DISPUTE_DECISIONS[decisionKey]}.` },
    ];
    rows.push({
      requestId: request.id, clientId: request.clientId, supplierId: request.supplierId,
      openedAt: iso(openedMs), reason, status: "resolved", claimant, problem: text.problem,
      claim: text.claim, response: index % 5 === 4 ? null : text.response,
      attachments: ATTACHMENTS[(index + 1) % ATTACHMENTS.length], history, notes: [],
      decision: { type: decisionKey, justification, at: iso(resolvedMs), by: ADMIN_ACTOR },
    });
  });

  // IDs sequenciais por data de abertura (CT0001 = a mais antiga).
  return rows
    .sort((a, b) => a.openedAt.localeCompare(b.openedAt))
    .map((row, index) => ({ id: `CT${String(index + 1).padStart(4, "0")}`, ...row }));
}

export const adminDisputes = build();
