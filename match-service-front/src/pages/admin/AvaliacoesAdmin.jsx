import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminStatTile from "../../components/admin/AdminStatTile";
import ReviewFilters from "../../components/admin/reviews/ReviewFilters";
import ReviewsTable from "../../components/admin/reviews/ReviewsTable";
import ReviewCardList from "../../components/admin/reviews/ReviewCardList";
import { HideReviewDialog, RestoreReviewDialog, ViewReviewDialog } from "../../components/admin/reviews/ReviewDialogs";
import Pagination from "../../components/admin/Pagination";
import useAdminReviews from "../../context/useAdminReviews";
import { PAGE_SIZE, PERIODS, REVIEW_STATUSES, filterReviews, paginate, sortNewestFirst, summarizeReviews } from "../../services/adminReviews";

/**
 * Gestão de avaliações (/admin/avaliacoes): consulta e moderação DEMONSTRATIVA
 * (ocultar com justificativa / restaurar), guardada só neste navegador. O
 * administrador não altera nota nem comentário. A média considera apenas as
 * avaliações publicadas. Filtros e página ficam na URL
 * (?q=&nota=&situacao=&periodo=&pagina=). 4 por página.
 */
export default function AvaliacoesAdmin() {
  const { reviews, hide, restore } = useAdminReviews();
  const [params, setParams] = useSearchParams();
  const [dialog, setDialog] = useState(null); // { type: "view" | "hide" | "restore", id }
  const [feedback, setFeedback] = useState("");

  const query = params.get("q") ?? "";
  const rating = ["1", "2", "3", "4", "5"].includes(params.get("nota")) ? params.get("nota") : "all";
  const status = params.get("situacao") in REVIEW_STATUSES ? params.get("situacao") : "all";
  const period = PERIODS.some((p) => p.value === params.get("periodo")) ? params.get("periodo") : "all";
  const requestedPage = Number(params.get("pagina")) || 1;

  function update(changes) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === "all" || (key === "pagina" && value === 1)) next.delete(key);
      else next.set(key, String(value));
    }
    setParams(next, { replace: true });
  }
  const updateFilter = (changes) => update({ ...changes, pagina: 1 });

  const summary = useMemo(() => summarizeReviews(reviews), [reviews]);
  const filtered = useMemo(
    () => sortNewestFirst(filterReviews(reviews, { query, rating, status, period })),
    [reviews, query, rating, status, period],
  );
  const pageData = paginate(filtered, requestedPage, PAGE_SIZE);
  const current = dialog ? reviews.find((r) => r.id === dialog.id) : null;
  const closeDialog = () => setDialog(null);
  const moderate = (review) => setDialog({ type: review.status === "hidden" ? "restore" : "hide", id: review.id });
  const view = (review) => setDialog({ type: "view", id: review.id });
  const average = summary.average === null ? "—" : summary.average.toFixed(1).replace(".", ",");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:gap-3">
      <header>
        <h1 className="adm-page-title">Gestão de avaliações</h1>
      </header>

      {feedback && (
        <p role="status" className="adm-text rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400">{feedback}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <AdminStatTile icon="star" tone="orange" label="Total de avaliações" value={summary.total} />
        <AdminStatTile icon="star" tone="amber" label="Média geral das notas" value={average} />
        <AdminStatTile icon="checkCircle" tone="green" label="Avaliações publicadas" value={summary.published} />
        <AdminStatTile icon="eyeOff" tone="red" label="Avaliações ocultadas" value={summary.hidden} />
      </div>

      <ReviewFilters
        query={query}
        rating={rating}
        status={status}
        period={period}
        onQueryChange={(value) => updateFilter({ q: value })}
        onRatingChange={(value) => updateFilter({ nota: value })}
        onStatusChange={(value) => updateFilter({ situacao: value })}
        onPeriodChange={(value) => updateFilter({ periodo: value })}
        onClear={() => setParams(new URLSearchParams(), { replace: true })}
      />

      <section aria-label="Lista de avaliações" className="rounded-[20px] border border-hairline bg-surface-1">
        {pageData.total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="adm-text font-medium text-cream">Nenhuma avaliação encontrada</p>
            <p className="adm-text mt-1 text-cream/60">Ajuste a busca ou os filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block"><ReviewsTable reviews={pageData.items} onView={view} onModerate={moderate} /></div>
            <div className="xl:hidden"><ReviewCardList reviews={pageData.items} onView={view} onModerate={moderate} /></div>
            <div className="border-t border-hairline">
              <Pagination
                page={pageData.page}
                totalPages={pageData.totalPages}
                total={pageData.total}
                start={pageData.start}
                pageSize={PAGE_SIZE}
                itemLabel="avaliações"
                onPageChange={(page) => update({ pagina: page })}
              />
            </div>
          </>
        )}
      </section>

      {current && dialog.type === "view" && <ViewReviewDialog review={current} onModerate={moderate} onClose={closeDialog} />}
      {current && dialog.type === "hide" && (
        <HideReviewDialog
          review={current}
          onClose={closeDialog}
          onConfirm={(reason) => {
            hide(current.id, reason);
            closeDialog();
            setFeedback("Avaliação ocultada (demonstrativo: guardada só neste navegador). Ela não entra mais na média pública.");
          }}
        />
      )}
      {current && dialog.type === "restore" && (
        <RestoreReviewDialog
          review={current}
          onClose={closeDialog}
          onConfirm={(reason) => {
            restore(current.id, reason);
            closeDialog();
            setFeedback("Avaliação restaurada (demonstrativo: guardada só neste navegador).");
          }}
        />
      )}
    </div>
  );
}
