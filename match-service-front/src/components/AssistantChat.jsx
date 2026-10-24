import { useState } from "react";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

const MOCK_REPLY =
  "Entendi. Baseado no que você descreveu, isso parece se encaixar no catálogo de serviços — em breve vou poder consultar fornecedores reais via Django, mas por enquanto essa resposta é só ilustrativa.";

const INITIAL_MESSAGES = [
  {
    id: "m0",
    role: "assistant",
    text: "Oi! Me conta o que você precisa que eu ajudo a encontrar o serviço certo.",
  },
];

// Atalhos para quem não sabe por onde começar: preenchem o campo, não enviam.
const STARTERS = [
  "Preciso de limpeza para o meu escritório",
  "Meu financeiro está desorganizado",
  "Quero manutenção predial recorrente",
];

/**
 * Interface visual do Assistente IA. NÃO faz integração real com
 * nenhum modelo — usa respostas mockadas apenas para permitir testar a
 * interface. A integração de verdade será React → Django → DeepSeek,
 * implementada em uma etapa futura.
 */
export default function AssistantChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const userMessage = { id: crypto.randomUUID(), role: "user", text };
    const mockAssistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: MOCK_REPLY,
    };

    setMessages((prev) => [...prev, userMessage, mockAssistantMessage]);
    setDraft("");
  }

  return (
    <div className="flex h-[min(72vh,44rem)] min-h-[28rem] flex-col rounded-[20px] border border-hairline bg-surface-1">
      <div className="border-b border-hairline px-5 py-4">
        <p className="app-small text-cream/70">
          Respostas simuladas nesta etapa — integração real via Django +
          DeepSeek chega depois.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 app-text ${
              message.role === "assistant"
                ? "bg-surface-2 text-cream/90"
                : "ml-auto bg-orange-soft text-orange"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {messages.length === 1 && (
        <ul className="flex flex-wrap gap-2 px-5 pb-3" aria-label="Sugestões para começar">
          {STARTERS.map((starter) => (
            <li key={starter}>
              <button
                type="button"
                onClick={() => setDraft(starter)}
                className="app-small inline-flex min-h-10 items-center rounded-full border border-hairline px-4 text-cream/80 transition hover:border-orange/60 hover:text-orange"
              >
                {starter}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-hairline p-3">
        <div className="min-w-0 flex-1">
          <Textarea
            id="assistant-draft"
            appearance="app"
            aria-label="Mensagem para a assistente"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // Enter envia; Shift+Enter quebra a linha.
              if (event.key === "Enter" && !event.shiftKey) handleSend(event);
            }}
            placeholder="Descreva o que você precisa..."
            rows={2}
            className="resize-none"
          />
        </div>
        <Button type="submit" appearance="app" disabled={!draft.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  );
}
