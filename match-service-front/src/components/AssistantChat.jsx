import { useCallback, useEffect, useRef, useState } from "react";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import { sendChat } from "../services/chat";

const GREETING = {
  id: "m0",
  role: "assistant",
  greeting: true,
  text: "Oi! Sou a Mia. Me conta o que está travando o seu negócio e eu te ajudo a entender o que fazer e que tipo de serviço resolve.",
};

const ERROR_TEXT =
  "Não consegui falar com a Mia agora. Sua mensagem foi mantida — tente de novo em instantes.";

// As respostas da Mia usam **negrito** (formato do diagnóstico). Renderiza só
// isso, sem HTML cru, e preserva as quebras de linha via whitespace-pre-wrap.
function renderText(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Chat do Assistente IA (Mia). Conversa de verdade com o backend
 * (POST /api/chat → chatbot-service). O histórico vive aqui no estado do
 * componente: recarregar a página começa uma conversa nova.
 */
export default function AssistantChat({ initialPrompt = "" }) {
  // Vindo do Dashboard com um sintoma já descrito, a conversa abre com ele
  // e a primeira resposta é pedida ao montar.
  const [messages, setMessages] = useState(() =>
    initialPrompt
      ? [GREETING, { id: "m-initial-user", role: "user", text: initialPrompt }]
      : [GREETING],
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(Boolean(initialPrompt));
  const [error, setError] = useState("");
  const startedRef = useRef(false);
  const endRef = useRef(null);

  const requestReply = useCallback(
    (history) =>
      sendChat(history)
        .then((reply) =>
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", text: reply },
          ]),
        )
        .catch(() => setError(ERROR_TEXT))
        .finally(() => setSending(false)),
    [],
  );

  useEffect(() => {
    if (!initialPrompt || startedRef.current) return;
    startedRef.current = true;
    requestReply(messages);
  }, [initialPrompt, messages, requestReply]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending, error]);

  function submit() {
    const text = draft.trim();
    if (!text || sending) return;

    const next = [...messages, { id: crypto.randomUUID(), role: "user", text }];
    setMessages(next);
    setDraft("");
    setError("");
    setSending(true);
    requestReply(next);
  }

  function handleSend(event) {
    event.preventDefault();
    submit();
  }

  // Enter envia; Shift+Enter quebra a linha.
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  function handleRetry() {
    setError("");
    setSending(true);
    requestReply(messages);
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-[20px] border border-hairline bg-surface-1">
      <div className="border-b border-hairline px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
          Mia — Assistente IA
        </p>
        <p className="mt-1 text-xs text-cream/50">
          Orientação geral. Não substitui contador, advogado ou consultor.
        </p>
      </div>

      <div
        role="log"
        aria-live="polite"
        aria-label="Conversa com a Mia"
        className="flex-1 space-y-3 overflow-y-auto px-5 py-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
              message.role === "assistant"
                ? "bg-surface-2 text-cream/90"
                : "ml-auto bg-orange-soft text-orange"
            }`}
          >
            {renderText(message.text)}
          </div>
        ))}

        {sending && (
          <div className="max-w-[80%] rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-cream/60">
            A Mia está escrevendo…
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex max-w-[80%] flex-wrap items-center gap-3 rounded-2xl border border-red-400/40 px-4 py-2.5 text-sm text-red-300"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={handleRetry}
              className="font-medium text-orange underline-offset-2 hover:underline"
            >
              Tentar de novo
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-hairline p-3">
        <div className="flex-1">
          <Textarea
            id="assistant-draft"
            aria-label="Mensagem para a Mia"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva o que você precisa..."
            rows={1}
          />
        </div>
        <Button type="submit" disabled={!draft.trim() || sending} className="self-start">
          Enviar
        </Button>
      </form>
    </div>
  );
}
