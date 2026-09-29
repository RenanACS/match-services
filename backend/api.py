from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fastapi import HTTPException

from agent import SYSTEM_PROMPT, perguntar, resumir
from catalog import classificar
from companies import buscar_por_categoria, buscar_por_id

app = FastAPI(title="MATCH SERVICES — Agente de Diagnóstico")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # protótipo: sem domínio de produção ainda
    allow_methods=["*"],
    allow_headers=["*"],
)

FRASES_DE_FECHAMENTO = [
    "fecha", "pode fechar", "encerra", "é isso", "so isso", "só isso",
    "não sei mais", "nao sei mais", "finaliza",
]


class Mensagem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    historico: list[Mensagem]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(req: ChatRequest):
    historico = [m.model_dump() for m in req.historico]
    mensagens_usuario = [m for m in historico if m["role"] == "user"]

    texto_usuario = " ".join(m["content"] for m in mensagens_usuario)
    categoria = classificar(texto_usuario)

    pedido_fechamento = any(
        frase in mensagens_usuario[-1]["content"].lower()
        for frase in FRASES_DE_FECHAMENTO
    ) if mensagens_usuario else False

    # Fecha o diagnóstico de forma determinística (nunca via texto livre do
    # modelo) assim que houver pelo menos 2 mensagens do usuário e uma
    # categoria do catálogo fechado for identificada, ou se o usuário pedir
    # explicitamente para encerrar.
    deve_fechar = categoria is not None and (
        len(mensagens_usuario) >= 2 or pedido_fechamento
    )

    if deve_fechar:
        resumo = resumir(mensagens_usuario)
        empresas = buscar_por_categoria(categoria)
        reply = (
            f"Entendi — isso se encaixa em **{categoria}**. {resumo} "
            f"Já separei fornecedores verificados por CNPJ nessa área, dá uma "
            "olhada nas opções abaixo."
        )
        return {"reply": reply, "categoria": categoria, "empresas": empresas}

    if categoria is None and len(mensagens_usuario) >= 2:
        reply = (
            "Não encontrei nenhuma categoria do nosso catálogo fechado que "
            "corresponda ao que você descreveu. Isso é proposital: o agente "
            "não inventa serviços fora do catálogo. Pode tentar descrever de "
            "outra forma?"
        )
        return {"reply": reply, "categoria": None, "empresas": []}

    historico_llm = [{"role": "system", "content": SYSTEM_PROMPT}] + historico
    reply = perguntar(historico_llm)
    return {"reply": reply, "categoria": None, "empresas": []}


@app.get("/empresas/{empresa_id}")
def empresa(empresa_id: str):
    encontrada = buscar_por_id(empresa_id)
    if not encontrada:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return encontrada
