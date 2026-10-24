import { StarIcon } from "./icons";

/** Nota de 1 a 5 em estrelas (preenchidas em laranja). */
export default function Stars({ value, size = 16 }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          width={size}
          height={size}
          fill={n <= Math.round(value) ? "currentColor" : "none"}
          className={n <= Math.round(value) ? "text-orange" : "text-cream/70"}
        />
      ))}
    </span>
  );
}
