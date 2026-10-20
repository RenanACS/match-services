import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-mark.png";

const NAV_LINKS = [
  { href: "#top", id: "top", label: "Início" },
  { href: "#como-funciona", id: "como-funciona", label: "Como funciona" },
  { href: "#custodia", id: "custodia", label: "Custódia" },
  { href: "#comparacao", id: "comparacao", label: "Comparação" },
];

export default function Header() {
  const [activeId, setActiveId] = useState("top");

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 max-[360px]:gap-2 max-[360px]:px-3">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-9 w-auto" />
          <span className="hidden font-display text-sm font-semibold tracking-wide text-cream sm:inline lg:hidden xl:inline">
            MATCH SERVICES
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border hairline bg-charcoal/60 p-1 backdrop-blur-md lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActiveId(link.id)}
              className={
                activeId === link.id
                  ? "whitespace-nowrap rounded-full bg-cream px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors"
                  : "whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream/70 transition-colors hover:text-orange"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Ações: Login, Criar conta e Testar diagnóstico lado a lado.
            Compactas abaixo de xl para não colidirem com o menu central. */}
        <div className="flex items-center gap-2 max-[380px]:gap-1 xl:gap-2 2xl:gap-3">
          <Link
            to="/login"
            className="rounded-full border border-cream/30 px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-widest max-[380px]:px-2 max-[380px]:tracking-wider max-[360px]:px-1.5 text-cream transition hover:border-orange hover:text-orange sm:px-4 sm:text-xs xl:px-4 xl:py-2.5 2xl:px-5"
          >
            Login
          </Link>
          <Link
            to="/cadastro"
            className="whitespace-nowrap rounded-full border border-cream bg-cream px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-widest max-[380px]:px-2 max-[380px]:tracking-wider max-[360px]:px-1.5 text-ink transition hover:bg-cream/90 sm:px-4 sm:text-xs xl:px-4 xl:py-2.5 2xl:px-5"
          >
            Criar conta
          </Link>
          <a
            href="#diagnostico-demo"
            aria-label="Testar diagnóstico"
            className="whitespace-nowrap rounded-full border border-orange bg-orange px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-widest max-[380px]:px-2 max-[380px]:tracking-wider max-[360px]:px-1.5 text-ink transition hover:bg-orange/90 sm:px-4 sm:text-xs xl:px-4 xl:py-2.5 2xl:px-5"
          >
            <span className="sm:hidden">Diagnóstico</span>
            <span className="hidden sm:inline">Testar diagnóstico</span>
          </a>
        </div>
      </div>
    </header>
  );
}
