import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminDisputesContext } from "./AdminDisputesContext";
import { ADMIN_ACTOR, DISPUTE_DECISIONS } from "../data/adminDisputes";
import { applyOverrides, baseDisputes } from "../services/adminDisputes";
import { getPayment } from "../services/adminPayments";
import {
  DISPUTES_STORAGE_KEY as STORAGE_KEY,
  buildFinancialRecord,
  getAvailableBalance,
  sanitizeFinancial,
  summarizeFinancial,
  validateResolution,
} from "../services/disputeFinancials";
import { formatBRL } from "../utils/currency";
import { loadDemoState, saveDemoState } from "../utils/demoStorage";
const VALID_STATUS = ["analysis", "resolved"];

function loadOverrides() {
  const parsed = loadDemoState(STORAGE_KEY, {});
  const clean = {};
  for (const [id, value] of Object.entries(parsed)) {
    if (!baseDisputes.some((d) => d.id === id) || !value || typeof value !== "object") continue;
    const decision = value.decision && value.decision.type in DISPUTE_DECISIONS ? value.decision : undefined;
    // Registro financeiro adulterado ou incoerente: descarta TODO o estado
    // guardado desta contestação (decisão, status e histórico), sem aproveitar nada.
    if (decision?.financial !== undefined && !sanitizeFinancial(decision.financial)) continue;
    const status = decision || value.status === "analysis" ? value.status : undefined;
    clean[id] = {
      status: VALID_STATUS.includes(status) ? status : undefined,
      decision,
      notes: Array.isArray(value.notes) ? value.notes : [],
      history: Array.isArray(value.history) ? value.history : [],
    };
  }
  return clean;
}

/**
 * Provider (e rota-layout) da seção Contestações. Guarda as ações DEMONSTRATIVAS
 * do administrador (assumir análise, observações, decisão) para que lista e
 * detalhes mostrem o mesmo estado, e as persiste no localStorage deste
 * navegador.
 *
 * NÃO é backend: o localStorage não é banco de dados, ninguém mais vê estas
 * alterações, e registrar uma decisão NÃO muda pagamento, repasse, estorno ou
 * qualquer operação financeira. Para voltar ao estado inicial, limpe a chave
 * "matchservice.admin.disputes.v1" (ou os dados do site).
 */
export default function AdminDisputesProvider() {
  const [overrides, setOverrides] = useState(loadOverrides);

  useEffect(() => {
    saveDemoState(STORAGE_KEY, overrides);
  }, [overrides]);

  const disputes = useMemo(() => applyOverrides(overrides), [overrides]);
  const disputesRef = useRef(disputes);

useEffect(() => {
  disputesRef.current = disputes;
}, [disputes]);

  // Transição com validação do estado atual (ignora ações incompatíveis).
  const update = useCallback((id, allowed, build) => {
    setOverrides((current) => {
      const base = baseDisputes.find((d) => d.id === id);
      if (!base) return current;
      const status = current[id]?.status ?? base.status;
      if (!allowed.includes(status)) return current;
      const previous = current[id] ?? { notes: [], history: [] };
      const now = new Date().toISOString();
      return { ...current, [id]: { ...previous, ...build(previous, now) } };
    });
  }, []);

  const actions = useMemo(
    () => ({
      assume: (id) =>
        update(id, ["open"], (prev, at) => ({
          status: "analysis",
          history: [...prev.history, { type: "taken", at, by: ADMIN_ACTOR, text: "Análise assumida." }],
        })),
      addNote: (id, text) => {
        const value = text.trim();
        if (!value) return;
        update(id, ["open", "analysis"], (prev, at) => ({
          notes: [...prev.notes, { at, by: ADMIN_ACTOR, text: value }],
          history: [...prev.history, { type: "note", at, by: ADMIN_ACTOR, text: "Observação interna registrada." }],
        }));
      },
      /**
       * Conclui a contestação: decisão administrativa + destinação financeira
       * DEMONSTRATIVA, em um único registro. Revalida tudo (a tela não é a
       * fonte de verdade) e só aceita contestações "Em análise" ainda sem
       * decisão, então a mesma decisão não é registrada duas vezes.
       * Retorna { ok, errors }. Nada é reembolsado, estornado ou repassado.
       */
      conclude: (id, fields) => {
        const dispute = disputesRef.current.find((d) => d.id === id);
        if (!dispute) return { ok: false, errors: { form: "Contestação não encontrada." } };
        if (dispute.status !== "analysis" || dispute.decision) {
          return { ok: false, errors: { form: "Esta contestação não está disponível para conclusão (já foi decidida ou não está em análise)." } };
        }
        const payment = getPayment(`PG${dispute.requestId}`);
        const check = validateResolution(fields, getAvailableBalance(payment), "all");
        if (!check.ok) return { ok: false, errors: check.errors };
        const justification = String(fields.justification).trim();
        const financial = buildFinancialRecord(check.resolution, { disputeId: id, requestId: dispute.requestId, paymentId: payment?.id ?? null });
        update(id, ["analysis"], (prev, at) => ({
          status: "resolved",
          decision: { type: fields.decision, justification, at, by: ADMIN_ACTOR, financial },
          history: [
            ...prev.history,
            { type: "decision", at, by: ADMIN_ACTOR, text: `Decisão registrada: ${DISPUTE_DECISIONS[fields.decision]}.${financial.refundType ? ` Reembolso ${financial.refundType === "full" ? "integral" : "parcial"}.` : ""}`, justification },
            { type: "financial", at, by: ADMIN_ACTOR, text: financial.authorizationStatus === "demo_authorized" ? "Destinação financeira autorizada (demonstrativa), não executada." : "Sem destinação financeira autorizada.", detail: summarizeFinancial(financial, formatBRL), financial },
          ],
        }));
        return { ok: true, errors: {}, financial };
      },
    }),
    [update],
  );

  const value = useMemo(
    () => ({ disputes, getDispute: (id) => disputes.find((d) => d.id === id), ...actions }),
    [disputes, actions],
  );

  return (
    <AdminDisputesContext.Provider value={value}>
      <Outlet />
    </AdminDisputesContext.Provider>
  );
}
