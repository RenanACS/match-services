import DiagnosisDemo from "./DiagnosisDemo";
import DemandForm from "./DemandForm";

export default function PathsSection() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-orange">
          Como funciona
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-cream md:text-4xl">
          Dois caminhos, um único fluxo confiável
        </h2>
        <p className="mt-3 text-cream/70">
          Teste os dois abaixo — são simulações reais, rodando inteiramente
          no seu navegador, sem backend.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <DiagnosisDemo />
        <DemandForm />
      </div>
    </section>
  );
}
