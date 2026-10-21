import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminDisputesContext } from "./AdminDisputesContext";
import { ADMIN_ACTOR, DISPUTE_DECISIONS } from "../data/adminDisputes";
import { MIN_TEXT, applyOverrides, baseDisputes } from "../services/adminDisputes";
import { loadDemoState, saveDemoState } from "../utils/demoStorage";

const STORAGE_KEY = "matchservice.admin.disputes.v1";
const VALID_STATUS = ["analysis", "resolved"];

function loadOverrides() {
  const parsed = loadDemoState(STORAGE_KEY, {});
  const clean = {};
  for (const [id, value] of Object.entries(parsed)) {
    if (!baseDisputes.some((d) => d.id === id) || !value || typeof value !== "object") continue;
    clean[id] = {
      status: VALID_STATUS.includes(value.status) ? value.status : undefined,
      decision: value.decision && value.decision.type in DISPUTE_DECISIONS ? value.decision : undefined,
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
      conclude: (id, decisionType, justification) => {
        const value = justification.trim();
        if (!(decisionType in DISPUTE_DECISIONS) || value.length < MIN_TEXT) return;
        update(id, ["analysis"], (prev, at) => ({
          status: "resolved",
          decision: { type: decisionType, justification: value, at, by: ADMIN_ACTOR },
          history: [...prev.history, { type: "decision", at, by: ADMIN_ACTOR, text: `Decisão registrada: ${DISPUTE_DECISIONS[decisionType]}.` }],
        }));
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
