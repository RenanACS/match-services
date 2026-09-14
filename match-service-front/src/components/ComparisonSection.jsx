const ROWS = [
  {
    label: "Descoberta da necessidade",
    traditional: "Busca por palavra-chave",
    match: "Agente de IA traduz sintoma em serviço",
  },
  {
    label: "Contrato",
    traditional: "Fora da plataforma",
    match: "Gerado e assinado no app",
  },
  {
    label: "Pagamento",
    traditional: "Fora da plataforma",
    match: "Retido em custódia, liberado só após aprovação",
  },
  {
    label: "Reputação e histórico",
    traditional: "Avaliações sem verificação de transação",
    match: "Só de quem concluiu uma transação real",
  },
  {
    label: "Cadastro de fornecedor",
    traditional: "Barreira baixa",
    match: "CNPJ obrigatório e verificado",
  },
];

export default function ComparisonSection() {
  return (
    <section id="comparacao" className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-orange">
          Comparação
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-cream md:text-4xl">
          O que um marketplace de busca não resolve
        </h2>
        <p className="mt-3 text-cream/70">
          Marketplaces tradicionais do setor conectam e saem de cena. A
          MATCH SERVICES fica até a entrega ser aprovada.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-2xl border hairline text-left text-sm">
          <thead>
            <tr className="border-b hairline bg-charcoal/60">
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-cream/60">
                Dimensão
              </th>
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-cream/60">
                Marketplace tradicional
              </th>
              <th className="p-4 font-mono text-xs uppercase tracking-widest text-orange">
                MATCH SERVICES
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b hairline last:border-b-0">
                <td className="p-4 font-medium text-cream">{row.label}</td>
                <td className="p-4 text-cream/60">{row.traditional}</td>
                <td className="p-4 text-cream/90">{row.match}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
