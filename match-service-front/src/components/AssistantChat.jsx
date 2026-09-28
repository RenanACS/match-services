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
    <div className="flex h-[32rem] flex-col rounded-[20px] border border-hairline bg-surface-1">
      <div className="border-b border-hairline px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
          Assistente IA
        </p>
        <p className="mt-1 text-xs text-cream/50">
          Respostas simuladas nesta etapa — integração real via Django +
          DeepSeek chega depois.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              message.role === "assistant"
                ? "bg-surface-2 text-cream/90"
                : "ml-auto bg-orange-soft text-orange"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-hairline p-3">
        <Textarea
          id="assistant-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Descreva o que você precisa..."
          rows={1}
          className="flex-1"
        />
        <Button type="submit" disabled={!draft.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  );
}
