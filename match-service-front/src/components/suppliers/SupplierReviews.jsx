import { StarIcon } from "./icons";

function ReviewStars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={index < rating ? "text-orange-light" : "text-cream/20"}
        />
      ))}
    </span>
  );
}

/**
 * Seção "Avaliações" — nota geral, quantidade total e só duas avaliações
 * recentes (não é uma lista extensa, e não há formulário para avaliar
 * nesta etapa: avaliações só existirão após um serviço concluído).
 */
export default function SupplierReviews({ rating, reviewsCount, reviews }) {
  return (
    <section aria-labelledby="supplier-reviews-title">
      <h2
        id="supplier-reviews-title"
        className="font-display text-lg font-semibold text-cream xl:text-base"
      >
        Avaliações
      </h2>

      <div className="mt-2 flex items-center gap-2 xl:mt-1.5">
        <span className="flex items-center gap-1 font-display text-2xl font-semibold text-cream xl:text-lg">
          <StarIcon className="text-orange-light" />
          {rating.toFixed(1).replace(".", ",")}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-cream/50">
          {reviewsCount} avaliações
        </span>
      </div>

      <ul className="mt-4 divide-y divide-hairline rounded-[20px] border border-hairline bg-surface-1 xl:mt-1.5">
        {reviews.map((review, index) => (
          <li key={index} className="px-4 py-3 xl:py-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-cream/80">{review.author}</span>
              <ReviewStars rating={review.rating} />
            </div>
            <p className="mt-1 text-sm text-cream/60 xl:mt-0.5 xl:leading-snug">
              &ldquo;{review.text}&rdquo;
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
