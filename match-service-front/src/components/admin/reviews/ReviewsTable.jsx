import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import ReviewStatusBadge from "./ReviewBadges";
import ReviewActions from "./ReviewActions";
import { formatDate } from "../../../utils/dates";

/**
 * Tabela (a partir de xl): Data | Cliente | Fornecedor | Nota | Comentário
 * (truncado; completo no modal) | Situação | Ações. table-fixed em porcentagem.
 */
export default function ReviewsTable({ reviews, onView, onModerate }) {
  const th = "adm-table px-2.5 py-3 font-medium text-cream/60 xl:py-2.5";
  const td = "px-2.5 py-3 xl:py-[9px]";
  return (
    <table className="w-full table-fixed text-left">
      <colgroup>
        <col className="w-[10.5%]" />
        <col className="w-[11.5%]" />
        <col className="w-[18%]" />
        <col className="w-[13%]" />
        <col className="w-[23%]" />
        <col className="w-[11%]" />
        <col className="w-[13%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-hairline">
          <th scope="col" className={`${th} pl-5`}>Data</th>
          <th scope="col" className={th}>Cliente</th>
          <th scope="col" className={th}>Fornecedor</th>
          <th scope="col" className={th}>Nota</th>
          <th scope="col" className={th}>Comentário</th>
          <th scope="col" className={th}>Situação</th>
          <th scope="col" className={`${th} pr-5`}>Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {reviews.map((r) => (
          <tr key={r.id} className="transition hover:bg-surface-2/60">
            <td className={`${td} adm-table whitespace-nowrap pl-5 text-cream/80`}>{formatDate(r.date)}</td>
            <td className={`${td} adm-table text-cream`}>{r.author}</td>
            <td className={td}>
              <Link to={`/admin/fornecedores/${r.supplierId}`} title={`Ver perfil de ${r.supplier.name}`} className="adm-table line-clamp-2 break-words text-cream transition hover:text-orange hover:underline">
                {r.supplier.name}
              </Link>
            </td>
            <td className={td}><RatingStars value={r.rating} /></td>
            <td className={td}><p title={r.comment} className="adm-table truncate text-cream/80">{r.comment}</p></td>
            <td className={td}><ReviewStatusBadge status={r.status} /></td>
            <td className={`${td} pr-5`}><ReviewActions review={r} onView={onView} onModerate={onModerate} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
