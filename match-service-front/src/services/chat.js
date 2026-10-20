import { api } from "./api";

/**
 * Envia a conversa para a Mia (POST /api/chat) e devolve o texto da resposta.
 * `messages` são as mensagens da interface ({ role, text }); só vão para o
 * servidor os turnos reais — a saudação local (`greeting`) fica de fora.
 */
export async function sendChat(messages) {
  const turns = messages
    .filter((message) => !message.greeting)
    .map(({ role, text }) => ({ role, content: text }));
  const data = await api.post("/chat", { messages: turns });
  return data.reply;
}
