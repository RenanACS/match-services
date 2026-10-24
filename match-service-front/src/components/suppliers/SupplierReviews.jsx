import Icon from "../ui/Icon";
import SectionTitle from "../ui/SectionTitle";

function ReviewStars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Icon
          key={index}
          name="star"
          size={14}
          className={`fill-current ${index < rating ? "text-orange-light" : "text-cream/70"}`}
        />
      ))}
    </span>
  );
}

/**
 * Seção "Avaliações" — nota geral, quantidade total e só duas avaliações
 * recentes (não há formulário para avaliar: avaliações só existirão após um
 * serviço concluído).
 */
export default function SupplierReviews({ rating, reviewsCount, reviews }) {
  return (
    <section aria-labelledby="supplier-reviews-title">
      <SectionTitle id="supplier-reviews-title">Avaliações</SectionTitle>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="app-stat-number flex items-center gap-1.5 text-cream">
          <Icon name="star" size={16} className="fill-current text-orange-light" />
          {rating.toFixed(1).replace(".", ",")}
        </span>
        <span className="app-small text-cream/70">{reviewsCount} avaliações</span>
      </div>

      <ul className="mt-2 divide-y divide-hairline rounded-[20px] border border-hairline bg-surface-1">
        {reviews.map((review, index) => (
          <li key={index} className="px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="app-text font-medium text-cream/80">{review.author}</span>
              <ReviewStars rating={review.rating} />
            </div>
            <p className="app-text mt-1 text-cream/70">&ldquo;{review.text}&rdquo;</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
