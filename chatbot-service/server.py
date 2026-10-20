"""
API HTTP da Mia para o frontend.

Run:  uvicorn server:app --port 8000
O Vite já encaminha /api -> http://127.0.0.1:8000 (ver vite.config.js), então
o frontend chama POST /api/chat sem configurar CORS.

Quando o Django existir, esta rota é o que migra para lá: o contrato
(`messages` -> `reply`) continua o mesmo e chatbot.ask() vira um serviço.
"""

import logging
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from chatbot import ChatbotConfigError, ask

logger = logging.getLogger("mia")

app = FastAPI(title="Mia — assistente MATCH SERVICES")


class Message(BaseModel):
    # O frontend nunca envia "system": as instruções ficam só no servidor.
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: list[Message] = Field(min_length=1, max_length=60)


class ChatResponse(BaseModel):
    reply: str
    model: str


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    history = [message.model_dump() for message in request.messages]
    if history[-1]["role"] != "user":
        raise HTTPException(status_code=422, detail="A última mensagem precisa ser do usuário.")

    try:
        reply, model = ask(history)
    except ChatbotConfigError:
        logger.exception("Mia sem configuração")
        raise HTTPException(status_code=503, detail="O assistente não está configurado.")
    except Exception:
        # 429 (limite dos modelos gratuitos), 402, rede... O detalhe vai para
        # o log, não para o navegador.
        logger.exception("Falha ao consultar o modelo")
        raise HTTPException(status_code=502, detail="O assistente está indisponível agora.")

    if not reply:
        raise HTTPException(status_code=502, detail="O assistente devolveu uma resposta vazia.")
    return ChatResponse(reply=reply, model=model)


@app.get("/api/health")
def health():
    return {"status": "ok"}
