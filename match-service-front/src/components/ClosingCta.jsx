export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="glass flex flex-col items-start gap-6 rounded-2xl p-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Veja o fluxo funcionando agora
          </h2>
          <p className="mt-2 max-w-md text-cream/70">
            Nenhum cadastro necessário para testar os dois caminhos — é um
            protótipo acadêmico, roda todo no seu navegador.
          </p>
        </div>
        <a
          href="#diagnostico-demo"
          className="shrink-0 rounded-full bg-orange px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-orange/90"
        >
          Testar diagnóstico
        </a>
      </div>
    </section>
  );
}
