import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const SAUDACAO = {
  role: "assistant",
  content:
    "Oi! Sou o agente de diagnóstico da MATCH SERVICES. Me conta, com suas " +
    "palavras, qual problema você tá enfrentando na operação da sua empresa.",
};

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function EmpresaCard({ empresa }) {
  return (
    <div className="rounded-lg border hairline bg-charcoal p-3">
      <div className="flex items-start justify-between gap-2">
        <a
          href={`#/empresa/${empresa.id}`}
          className="text-sm font-medium text-cream hover:text-orange hover:underline"
        >
          {empresa.nome}
        </a>
        <span className="shrink-0 font-mono text-[11px] text-orange">
          ★ {empresa.avaliacao}
        </span>
      </div>
      <p className="mt-1 text-xs text-cream/60">{empresa.descricao}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        {empresa.cidade} · CNPJ {empresa.cnpj}
      </p>
      <a
        href={`#/empresa/${empresa.id}`}
        className="mt-2 inline-block font-mono text-[10px] uppercase tracking-widest text-orange hover:underline"
      >
        Ver página da empresa →
      </a>
    </div>
  );
}

export default function ChatWidget() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([SAUDACAO]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [erro, setErro] = useState(null);
  const fimRef = useRef(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  async function enviar(event) {
    event.preventDefault();
    const pergunta = texto.trim();
    if (!pergunta || carregando) return;

    const historico = [...mensagens, { role: "user", content: pergunta }];
    setMensagens(historico);
    setTexto("");
    setCarregando(true);
    setErro(null);

    try {
      const resp = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          historico: historico
            .filter((m) => m !== SAUDACAO)
            .map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setMensagens((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setEmpresas(data.empresas || []);
    } catch {
      setErro(
        "Não consegui falar com o agente agora. Confirme se a API " +
          "(backend/api.py) está rodando em " +
          API_URL +
          ".",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {aberto && (
        <div className="glass flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col rounded-2xl">
          <div className="flex items-center justify-between border-b hairline px-4 py-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
                Caminho A
              </p>
              <p className="font-display text-sm font-semibold text-cream">
                Agente de Diagnóstico
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar chat"
              className="rounded-full p-1 text-cream/60 hover:text-cream"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-xl bg-orange px-3 py-2 text-sm text-ink"
                    : "mr-8 whitespace-pre-line rounded-xl border hairline bg-charcoal px-3 py-2 text-sm text-cream/90"
                }
              >
                {m.content}
              </div>
            ))}

            {carregando && (
              <div className="mr-8 rounded-xl border hairline bg-charcoal px-3 py-2 text-sm text-cream/50">
                Digitando…
              </div>
            )}

            {erro && (
              <div className="rounded-xl border border-orange/40 bg-orange-soft px-3 py-2 text-xs text-cream/80">
                {erro}
              </div>
            )}

            {empresas.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cream/50">
                  Fornecedores sugeridos
                </p>
                {empresas.map((e) => (
                  <EmpresaCard key={e.cnpj} empresa={e} />
                ))}
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <form onSubmit={enviar} className="flex gap-2 border-t hairline p-3">
            <label htmlFor="chat-input" className="sr-only">
              Escreva sua mensagem
            </label>
            <input
              id="chat-input"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Descreva o problema..."
              className="min-h-[40px] flex-1 rounded-xl border hairline bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-cream/35 focus:border-orange"
            />
            <button
              type="submit"
              disabled={!texto.trim() || carregando}
              className="min-h-[40px] rounded-xl bg-orange px-4 font-mono text-xs font-medium uppercase tracking-widest text-ink transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label={aberto ? "Fechar chat" : "Abrir agente de diagnóstico"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-ink shadow-lg transition hover:bg-orange/90"
      >
        {aberto ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
