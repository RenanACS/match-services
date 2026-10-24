import { Link } from "react-router-dom";

const CLASS =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-cream/70 transition hover:border-orange/60 hover:text-orange";

/** Botão quadrado só com ícone (olho, lápis, lixeira), como link... */
export function IconLink({ to, label, children }) {
  return (
    <Link to={to} aria-label={label} title={label} className={CLASS}>
      {children}
    </Link>
  );
}

/** ...ou como botão. */
export function IconButton({ onClick, label, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={CLASS}>
      {children}
    </button>
  );
}
