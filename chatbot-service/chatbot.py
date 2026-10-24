"""
Mia, a assistente de diagnóstico da MATCH SERVICES, usando o OmniRoute
(gateway local compatível com a API da OpenAI) com a chave do .env.

Este módulo é o núcleo (`ask`) e também um chat de terminal para testar o
prompt sem subir o servidor:   python chatbot.py
A API HTTP que o frontend consome está em server.py.
As instruções do bot ficam em system_prompt.txt (mesma pasta).
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# ---------------------------------------------------------------------------
# Configuração: este bloco é o que muda conforme o projeto cresce
# ---------------------------------------------------------------------------

# O OmniRoute precisa estar rodando (`omniroute`). Endereço, chave e modelo vêm
# do .env; os padrões abaixo servem para o OmniRoute local. Modelos "auto/..."
# deixam o OmniRoute escolher e fazer o fallback (veja GET /v1/models).
DEFAULT_BASE_URL = "http://127.0.0.1:20128/v1"
DEFAULT_MODEL = "auto/best-chat"

# As instruções vivem num arquivo para o time editar sem mexer no código.
PROMPT_FILE = Path(__file__).parent / "system_prompt.txt"

# Primeira mensagem do chat de terminal (o frontend tem a própria saudação).
GREETING = (
    "Olá! Sou a Mia, assistente de diagnóstico da MATCH SERVICES. "
    "Me conte um pouco sobre o seu negócio e o que mais te preocupa hoje."
)

TEMPERATURE = 0.4   # baixo = consistente/factual, alto = criativo/variado
MAX_TOKENS = 2000   # limite da resposta; diagnósticos são longos e os modelos "pensam" antes
MAX_HISTORY = 30    # conversas de diagnóstico são longas, então guarda mais turnos
MODEL_ATTEMPTS = 2  # o provedor falha de vez em quando; tenta de novo uma vez

# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).parent / ".env")

BASE_URL = os.getenv("OMNIROUTE_BASE_URL") or DEFAULT_BASE_URL
MODEL = os.getenv("OMNIROUTE_MODEL") or DEFAULT_MODEL


class ChatbotConfigError(RuntimeError):
    """Falta algo local (chave da API ou arquivo de prompt)."""


class ModelUnavailableError(RuntimeError):
    """O OmniRoute respondeu, mas o modelo não gerou resposta."""


def _load_system_prompt():
    if not PROMPT_FILE.exists():
        raise ChatbotConfigError(f"Arquivo {PROMPT_FILE.name} não encontrado ao lado de chatbot.py.")
    return PROMPT_FILE.read_text(encoding="utf-8")


_client = None


def _get_client():
    """Cria o cliente na primeira chamada, para o servidor subir mesmo sem chave."""
    global _client
    if _client is None:
        api_key = os.getenv("OMNIROUTE_API_KEY")
        if not api_key:
            raise ChatbotConfigError("OMNIROUTE_API_KEY não encontrada. Confira o arquivo .env.")
        # O OmniRoute fala o mesmo formato da OpenAI: usamos a biblioteca
        # da OpenAI apontando para o endereço dele.
        _client = OpenAI(base_url=BASE_URL, api_key=api_key)
    return _client


def trim_history(history):
    """Mantém só os turnos recentes e garante que comecem por uma fala do usuário."""
    recent = history[-MAX_HISTORY:]
    while recent and recent[0]["role"] != "user":
        recent = recent[1:]
    return recent


def ask(history):
    """Recebe a conversa (turnos user/assistant) e devolve (resposta, modelo usado)."""
    messages = [{"role": "system", "content": _load_system_prompt()}] + trim_history(history)
    for attempt in range(MODEL_ATTEMPTS):
        response = _get_client().chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )
        # Às vezes o provedor falha e o gateway
        # devolve HTTP 200 com um corpo de erro e `choices` vazio.
        if response.choices:
            return response.choices[0].message.content, response.model
        detail = (response.model_extra or {}).get("error")
    raise ModelUnavailableError(f"Modelo sem resposta após {MODEL_ATTEMPTS} tentativas: {detail}")


def main():
    history = []  # turnos user/assistant; é a "memória" do bot

    print("(digite 'sair' para encerrar)\n")
    print(f"Mia: {GREETING}\n")
    while True:
        user_text = input("Você: ").strip()
        if not user_text:
            continue
        if user_text.lower() in {"exit", "quit", "sair"}:
            break

        history.append({"role": "user", "content": user_text})

        try:
            reply, used_model = ask(history)
        except ChatbotConfigError as error:
            raise SystemExit(str(error))
        except Exception as error:
            # 429 = limite de uso, 402 = sem crédito, 401 = chave inválida
            print(f"[erro] {error}\n")
            history.pop()  # descarta a pergunta que falhou para não sujar o histórico
            continue

        if not reply:
            reply = "(resposta vazia, tente aumentar MAX_TOKENS)"

        print(f"Mia [{used_model}]: {reply}\n")
        history.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
