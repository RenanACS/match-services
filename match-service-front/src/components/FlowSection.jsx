const STEPS = [
  { label: "Demanda publicada", detail: "Via diagnóstico ou demanda direta" },
  { label: "Fornecedores propõem", detail: "Apenas empresas com CNPJ verificado" },
  { label: "Comparação", detail: "Preço e reputação lado a lado" },
  { label: "Contrato digital", detail: "Gerado e assinado dentro do app" },
  { label: "Pagamento em custódia", detail: "Retido até a aprovação do comprador" },
  { label: "Entrega", detail: "Fornecedor executa o serviço" },
  { label: "Aprovação", detail: "Comprador confirma que recebeu" },
  { label: "Liberação + avaliação", detail: "Pagamento liberado, reputação só depois disso" },
];

export default function FlowSection() {
  return (
    <section id="custodia" className="border-y hairline bg-charcoal/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-orange">
            Custódia e confiança
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream md:text-4xl">
            Confiança é estrutural, não é selo
          </h2>
          <p className="mt-3 text-cream/70">
            O pagamento fica retido em custódia até você aprovar a entrega.
            A reputação de um fornecedor só existe depois de uma transação
            real e concluída — não antes.
          </p>
        </div>

        <ol className="mt-10 grid gap-3 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              className="rounded-xl border hairline bg-charcoal p-4"
            >
              <span className="font-mono text-[11px] text-orange">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-sm font-semibold text-cream">
                {step.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-cream/60">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
