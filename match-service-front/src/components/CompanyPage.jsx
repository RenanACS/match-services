import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function CompanyPage({ empresaId }) {
  const [empresa, setEmpresa] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setEmpresa(null);
    setErro(null);
    fetch(`${API_URL}/empresas/${empresaId}`)
      .then((resp) => {
        if (!resp.ok) throw new Error("not found");
        return resp.json();
      })
      .then(setEmpresa)
      .catch(() => setErro("Empresa não encontrada."));
  }, [empresaId]);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <a
        href="#/"
        className="font-mono text-xs uppercase tracking-widest text-orange hover:underline"
      >
        ← Voltar para a MATCH SERVICES
      </a>

      {erro && <p className="mt-8 text-cream/70">{erro}</p>}

      {empresa && (
        <div className="mt-8 rounded-2xl border hairline bg-charcoal p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-orange">
            {empresa.categoria}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-cream">
            {empresa.nome}
          </h1>
          <p className="mt-1 font-mono text-sm text-cream/50">
            ★ {empresa.avaliacao} · {empresa.cidade}
          </p>

          <p className="mt-6 text-cream/80">{empresa.descricao}</p>

          <div className="mt-8 grid gap-3 rounded-xl border hairline bg-ink p-4 font-mono text-xs text-cream/60">
            <p>CNPJ: {empresa.cnpj}</p>
            <p>Verificação: CNPJ validado na plataforma</p>
            <p>Reputação: histórico visível após transações concluídas</p>
          </div>

          <p className="mt-8 text-xs text-cream/40">
            Protótipo acadêmico — fornecedor fictício, dados de demonstração.
          </p>
        </div>
      )}
    </div>
  );
}
