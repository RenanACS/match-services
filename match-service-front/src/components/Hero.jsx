import poster from "../assets/match-services-hero-poster.webp";

const CHIPS = ["Custódia", "CNPJ verificado", "Contrato no app"];
const DOTS = 6;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden pt-32"
    >
      <div className="absolute inset-0">
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
          Protótipo acadêmico — marketplace B2B de serviços
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-cream md:text-6xl">
          MATCH SERVICES
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-orange/80 md:text-sm">
          Do sintoma ao contrato assinado
        </p>

        <div className="mt-10 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold leading-snug text-cream md:text-4xl">
            Pagamento em custódia até a entrega ser aprovada.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/75">
            Conectamos empresas que precisam de um serviço a fornecedores
            verificados por CNPJ — com diagnóstico por IA, contrato digital
            e pagamento liberado só após a aprovação da entrega.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#diagnostico-demo"
            className="flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-cream/90"
          >
            Testar diagnóstico
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] leading-none text-ink">
              ▶
            </span>
          </a>
          <a
            href="#demanda-demo"
            className="rounded-full border hairline px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-cream transition hover:border-orange/60"
          >
            Publicar demanda direta
          </a>
        </div>

        <div className="mb-10 mt-8 flex flex-wrap justify-center gap-2">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border hairline px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cream/60"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
        {Array.from({ length: DOTS }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === 0 ? "bg-orange" : "bg-cream/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
