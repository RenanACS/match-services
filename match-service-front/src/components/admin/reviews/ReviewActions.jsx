import Icon from "../AdminIcons";

const BTN = "flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-cream/80 transition hover:border-orange/60 hover:text-cream";

/** Ações da linha: ver o comentário completo (olho) e ocultar/restaurar (moderação). */
export default function ReviewActions({ review, onView, onModerate }) {
  const hidden = review.status === "hidden";
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={BTN} title="Ver avaliação completa" aria-label={`Ver avaliação completa de ${review.author}`} onClick={() => onView(review)}>
        <Icon name="eye" size={18} />
      </button>
      <button
        type="button"
        className={BTN}
        title={hidden ? "Restaurar avaliação" : "Ocultar avaliação"}
        aria-label={`${hidden ? "Restaurar" : "Ocultar"} avaliação de ${review.author}`}
        onClick={() => onModerate(review)}
      >
        <Icon name={hidden ? "refresh" : "eyeOff"} size={18} />
      </button>
    </div>
  );
}
