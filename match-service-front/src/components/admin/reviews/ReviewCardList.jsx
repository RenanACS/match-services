import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import ReviewStatusBadge from "./ReviewBadges";
import ReviewActions from "./ReviewActions";
import { formatDate } from "../../../utils/dates";

/** Lista em cartões para telas menores que xl (no lugar da tabela). */
export default function ReviewCardList({ reviews, onView, onModerate }) {
  return (
    <ul className="divide-y divide-hairline">
      {reviews.map((r) => (
        <li key={r.id} className="flex flex-col gap-2.5 p-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="adm-text font-medium text-cream">{r.author} <span className="font-normal text-cream/50">· {formatDate(r.date)}</span></p>
            <ReviewStatusBadge status={r.status} />
          </div>
          <Link to={`/admin/fornecedores/${r.supplierId}`} className="adm-text truncate text-cream/80 hover:text-orange hover:underline">{r.supplier.name}</Link>
          <RatingStars value={r.rating} />
          <p className="adm-text line-clamp-2 text-cream/80">{r.comment}</p>
          <ReviewActions review={r} onView={onView} onModerate={onModerate} />
        </li>
      ))}
    </ul>
  );
}
