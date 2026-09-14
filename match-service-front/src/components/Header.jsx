import { useEffect, useState } from "react";
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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-9 w-auto" />
          <span className="hidden font-display text-sm font-semibold tracking-wide text-cream sm:inline">
            MATCH SERVICES
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border hairline bg-charcoal/60 p-1 backdrop-blur-md md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setActiveId(link.id)}
              className={
                activeId === link.id
                  ? "rounded-full bg-cream px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors"
                  : "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream/70 transition-colors hover:text-orange"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#diagnostico-demo"
          className="rounded-full bg-orange px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-orange/90"
        >
          Testar diagnóstico
        </a>
      </div>
    </header>
  );
}
