import { useState } from "react";
import { CATALOG } from "../data/catalog";

function classify(text) {
  const normalized = text.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const category of CATALOG) {
    const score = category.keywords.reduce(
      (acc, keyword) => (normalized.includes(keyword) ? acc + 1 : acc),
      0,
    );
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }

  return best;
}

export default function DiagnosisDemo() {
  const [symptom, setSymptom] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setResult(classify(symptom));
    setSubmitted(true);
  }

  return (
    <div
      id="diagnostico-demo"
      className="glass flex flex-col rounded-2xl p-6 md:p-8"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-orange">
        Caminho A
      </span>
      <h3 className="mt-2 font-display text-2xl font-semibold text-cream">
        Diagnóstico assistido
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/70">
        Descreva o sintoma com suas palavras. O agente traduz para o catálogo
        fechado de serviços — sem inventar categorias fora dele.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-3">
        <label htmlFor="symptom" className="sr-only">
          Descreva o problema
        </label>
        <textarea
          id="symptom"
          value={symptom}
          onChange={(event) => setSymptom(event.target.value)}
          placeholder="Ex.: meu financeiro é uma bagunça, não sei nem quanto tenho a pagar esse mês"
          rows={3}
          className="min-h-[44px] w-full rounded-xl border hairline bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-orange"
        />
        <button
          type="submit"
          disabled={!symptom.trim()}
          className="min-h-[44px] rounded-xl bg-orange px-4 py-3 font-mono text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Rodar diagnóstico
        </button>
      </form>

      <div aria-live="polite" className="mt-4">
        {submitted && result && (
          <div className="rounded-xl border border-orange/40 bg-orange-soft p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
              Briefing estruturado
            </p>
            <p className="mt-2 text-sm text-cream/90">
              Categoria identificada:{" "}
              <strong className="text-cream">{result.label}</strong>
            </p>
            <p className="mt-1 text-sm text-cream/70">
              Próximo passo: fornecedores de {result.label.toLowerCase()}{" "}
              verificados por CNPJ recebem sua demanda e enviam proposta.
            </p>
          </div>
        )}
        {submitted && !result && (
          <div className="rounded-xl border hairline p-4">
            <p className="text-sm text-cream/70">
              Nenhuma categoria do catálogo fechado correspondeu ao texto.
              Isso é proposital: o agente não inventa serviços fora do
              catálogo — tente descrever com outras palavras.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-[11px] text-cream/40">
        Protótipo: classificação roda no navegador, nenhum dado sai daqui.
      </p>
    </div>
  );
}
