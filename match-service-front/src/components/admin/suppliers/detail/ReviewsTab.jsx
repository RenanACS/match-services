import { averageRating } from "../../../../services/adminSuppliers";
import { formatDate } from "../../../../utils/dates";

function Stars({ value }) {
  const full = Math.round(value);
  return (
    <span role="img" aria-label={`Nota ${value.toFixed(1).replace(".", ",")} de 5`} className="tracking-wider text-amber-400">
      {"★".repeat(full)}
      <span className="text-cream/70">{"★".repeat(5 - full)}</span>
    </span>
  );
}

/** Avaliação média, quantidade e comentários dos clientes (fictícios). */
export default function ReviewsTab({ supplier }) {
  const { reviews } = supplier;
  const average = averageRating(reviews);
  return (
    <section aria-labelledby="reviews-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="reviews-title" className="adm-section-title">Avaliações dos clientes</h2>
      {reviews.length === 0 ? (
        <p className="mt-4 adm-text text-cream/70">
          Este fornecedor ainda não recebeu avaliações, pois ainda não prestou serviços na plataforma.
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-4">
            <p className="adm-stat-number">{average.toFixed(1).replace(".", ",")}</p>
            <div>
              <Stars value={average} />
              <p className="mt-1 adm-small text-cream/70">
                {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>
          </div>
          <ul className="mt-5 divide-y divide-hairline">
            {reviews.map((review) => (
              <li key={review.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="adm-text font-medium text-cream">{review.author}</p>
                  <p className="adm-small text-cream/70">{formatDate(review.date)}</p>
                </div>
                <div className="mt-1 adm-text">
                  <Stars value={review.rating} />
                </div>
                <p className="mt-1.5 adm-text text-cream/70">{review.comment}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
