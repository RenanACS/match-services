import { useState } from "react";
import { CATALOG } from "../data/catalog";

const initialForm = {
  category: CATALOG[0].id,
  description: "",
  budget: "",
  document: "cpf",
};

export default function DemandForm() {
  const [form, setForm] = useState(initialForm);
  const [confirmed, setConfirmed] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.description.trim() || !form.budget) return;
    setConfirmed(form);
  }

  const categoryLabel =
    CATALOG.find((c) => c.id === form.category)?.label ?? form.category;

  return (
    <div id="demanda-demo" className="glass flex flex-col rounded-2xl p-6 md:p-8">
      <span className="font-mono text-xs uppercase tracking-widest text-orange">
        Caminho B
      </span>
      <h3 className="mt-2 font-display text-2xl font-semibold text-cream">
        Demanda direta
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/70">
        Já sabe exatamente o serviço? Publique direto com categoria,
        descrição e orçamento.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-3">
        <div>
          <label htmlFor="category" className="sr-only">
            Categoria
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
            className="min-h-[44px] w-full rounded-xl border hairline bg-charcoal px-4 py-3 text-sm text-cream focus:border-orange"
          >
            {CATALOG.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="sr-only">
            Descrição
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Ex.: limpeza de 4 splits de ar-condicionado, prédio comercial"
            rows={2}
            className="min-h-[44px] w-full rounded-xl border hairline bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-orange"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="budget" className="sr-only">
              Orçamento
            </label>
            <input
              id="budget"
              type="text"
              inputMode="numeric"
              value={form.budget}
              onChange={(event) => update("budget", event.target.value)}
              placeholder="Orçamento (R$)"
              className="min-h-[44px] w-full rounded-xl border hairline bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-orange"
            />
          </div>
        </div>

        <fieldset className="flex items-center gap-4">
          <legend className="sr-only">Documento</legend>
          {["cpf", "cnpj"].map((doc) => (
            <label
              key={doc}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cream/70"
            >
              <input
                type="radio"
                name="document"
                value={doc}
                checked={form.document === doc}
                onChange={(event) => update("document", event.target.value)}
                className="accent-orange"
              />
              {doc}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={!form.description.trim() || !form.budget}
          className="min-h-[44px] rounded-xl bg-orange px-4 py-3 font-mono text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Publicar demanda
        </button>
      </form>

      <div aria-live="polite" className="mt-4">
        {confirmed && (
          <div className="rounded-xl border border-orange/40 bg-orange-soft p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
              Protótipo: demanda preparada
            </p>
            <p className="mt-2 text-sm text-cream/90">
              {categoryLabel} · R$ {confirmed.budget} ·{" "}
              {confirmed.document.toUpperCase()}
            </p>
            <p className="mt-1 text-sm text-cream/70">
              Próximo passo real: fornecedores de CNPJ verificado enviam
              proposta, você compara e o contrato é gerado no app.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-[11px] text-cream/40">
        Protótipo: nenhum dado sai do navegador, nada é publicado de verdade.
      </p>
    </div>
  );
}
