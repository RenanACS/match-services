"""
Mia, a assistente de diagnóstico da MATCH SERVICES, usando modelos gratuitos
do OpenRouter.

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

# Tentados em ordem. Se o primeiro estiver com limite de uso ou indisponível,
# o OpenRouter passa para o próximo. Veja https://openrouter.ai/models?q=free
# para a lista atual — modelos gratuitos entram e saem.
MODELS = [
    "nvidia/nemotron-3.5-super-vl:free",
    "xingchen-agi/xing4.0-29b-a4b:free",
]

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
MODEL_ATTEMPTS = 2  # modelos gratuitos falham de vez em quando; tenta de novo uma vez

# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).parent / ".env")


class ChatbotConfigError(RuntimeError):
    """Falta algo local (chave da API ou arquivo de prompt)."""


class ModelUnavailableError(RuntimeError):
    """O OpenRouter respondeu, mas nenhum modelo gerou resposta."""


def _load_system_prompt():
    if not PROMPT_FILE.exists():
        raise ChatbotConfigError(f"Arquivo {PROMPT_FILE.name} não encontrado ao lado de chatbot.py.")
    return PROMPT_FILE.read_text(encoding="utf-8")


_client = None


def _get_client():
    """Cria o cliente na primeira chamada, para o servidor subir mesmo sem chave."""
    global _client
    if _client is None:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ChatbotConfigError("OPENROUTER_API_KEY não encontrada. Confira o arquivo .env.")
        # O OpenRouter fala o mesmo formato da OpenAI: usamos a biblioteca
        # da OpenAI apontando para o endereço dele.
        _client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)
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
            model=MODELS[0],
            messages=messages,
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
            extra_body={"models": MODELS},  # só do OpenRouter: lista de fallback
        )
        # Os modelos gratuitos às vezes falham no provedor e o OpenRouter
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
            # 429 = limite de uso, 402 = problema de crédito, 401 = chave inválida
            print(f"[erro] {error}\n")
            history.pop()  # descarta a pergunta que falhou para não sujar o histórico
            continue

        if not reply:
            reply = "(resposta vazia, tente aumentar MAX_TOKENS)"

        print(f"Mia [{used_model}]: {reply}\n")
        history.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
