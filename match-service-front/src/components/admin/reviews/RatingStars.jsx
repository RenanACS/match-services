import Icon from "../AdminIcons";

/** Estrelas padronizadas (5, preenchidas em âmbar conforme a nota) com texto acessível. */
export default function RatingStars({ value, size = 14, showNumber = true }) {
  return (
    <span role="img" aria-label={`Nota ${value} de 5`} className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon key={n} name="star" size={size} className={n <= Math.round(value) ? "fill-current text-amber-400" : "text-cream/70"} />
        ))}
      </span>
      {showNumber && <span aria-hidden="true" className="adm-small font-medium text-cream/80">{value}</span>}
    </span>
  );
}
