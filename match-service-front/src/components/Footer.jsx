import logo from "../assets/logo-mark.png";

export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-6 w-auto" />
            <span className="font-display text-sm font-semibold text-cream">
              MATCH SERVICES
            </span>
          </div>

          <nav className="flex gap-6">
            {[
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#custodia", label: "Custódia" },
              { href: "#comparacao", label: "Comparação" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-cream/60 hover:text-orange"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-cream/40">
          Protótipo acadêmico desenvolvido para a disciplina de Gestão de
          Projetos de Software. Não há clientes reais, transações
          processadas ou infraestrutura de produção — os fluxos acima são
          simulações client-side para ilustrar o mecanismo do produto.
        </p>

        <p className="mt-4 font-mono text-[11px] text-cream/30">
          © {new Date().getFullYear()} MATCH SERVICES
        </p>
      </div>
    </footer>
  );
}
