import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminReviewsContext } from "./AdminReviewsContext";
import { MIN_REASON, MODERATOR, applyOverrides, baseReviews } from "../services/adminReviews";
import { loadDemoState, saveDemoState } from "../utils/demoStorage";

const STORAGE_KEY = "matchservice.admin.reviews.v1";

function loadOverrides() {
  const parsed = loadDemoState(STORAGE_KEY, {});
  const clean = {};
  for (const [id, value] of Object.entries(parsed)) {
    if (!baseReviews.some((r) => r.id === id) || !value) continue;
    if (!["published", "hidden"].includes(value.status) || !Array.isArray(value.moderation)) continue;
    clean[id] = { status: value.status, moderation: value.moderation };
  }
  return clean;
}

/**
 * Provider (e rota-layout) da seção Avaliações. Guarda a moderação
 * DEMONSTRATIVA (ocultar/restaurar com justificativa) no localStorage deste
 * navegador. NÃO é backend: ninguém mais vê estas alterações, e o administrador
 * não altera nota nem comentário (só a situação). Para voltar ao estado inicial,
 * limpe a chave "matchservice.admin.reviews.v1" (ou os dados do site).
 */
export default function AdminReviewsProvider() {
  const [overrides, setOverrides] = useState(loadOverrides);

  useEffect(() => {
    saveDemoState(STORAGE_KEY, overrides);
  }, [overrides]);

  const reviews = useMemo(() => applyOverrides(overrides), [overrides]);

  // Só aceita a transição compatível com a situação atual (ocultar uma publicada, restaurar uma ocultada).
  const moderate = useCallback((id, from, to, action, reason) => {
    setOverrides((current) => {
      const base = baseReviews.find((r) => r.id === id);
      if (!base) return current;
      const status = current[id]?.status ?? base.status;
      if (status !== from) return current;
      const moderation = current[id]?.moderation ?? [];
      const entry = { action, reason, date: new Date().toISOString(), by: MODERATOR };
      return { ...current, [id]: { status: to, moderation: [...moderation, entry] } };
    });
  }, []);

  const actions = useMemo(
    () => ({
      hide: (id, reason) => {
        const value = reason.trim();
        if (value.length >= MIN_REASON) moderate(id, "published", "hidden", "hide", value);
      },
      restore: (id, reason = "") => moderate(id, "hidden", "published", "restore", reason.trim()),
    }),
    [moderate],
  );

  const value = useMemo(() => ({ reviews, ...actions }), [reviews, actions]);

  return (
    <AdminReviewsContext.Provider value={value}>
      <Outlet />
    </AdminReviewsContext.Provider>
  );
}
