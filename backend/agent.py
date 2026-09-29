import os
import re

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODELO = "liquid/lfm-2.5-2.6b:free"

# Catálogo fechado de serviços — mesmo conjunto de categorias usado no
# classificador do front-end (match-service-front/src/data/catalog.js).
# O agente NUNCA deve diagnosticar uma categoria fora desta lista.
CATALOGO = [
    "Financeiro / BPO",
    "Tecnologia",
    "Limpeza",
    "Manutenção Predial",
    "Marketing",
    "Jurídico",
    "RH",
]

SYSTEM_PROMPT = f"""Você é o Agente de Diagnóstico da MATCH SERVICES, um marketplace B2B \
que conecta contratantes (empresas ou pessoas físicas com CPF/CNPJ) a fornecedores \
de serviços (sempre CNPJ).

Seu papel é o "Caminho A — Diagnóstico assistido": o contratante chega com um sintoma \
vago sobre a operação dele (ex.: "meu financeiro é uma bagunça"), não com o nome de um \
serviço. Você conduz uma conversa curta e guiada para traduzir esse sintoma em um \
briefing estruturado.

Catálogo fechado de categorias (é o único vocabulário permitido para diagnóstico):
{chr(10).join(f"- {c}" for c in CATALOGO)}

IMPORTANTE: você nunca fecha o diagnóstico sozinho — isso é decidido por um \
classificador determinístico fora do seu controle. Sua única tarefa aqui é fazer \
EXATAMENTE UMA pergunta objetiva de esclarecimento por vez, para ajudar a apontar \
qual das 7 categorias acima descreve melhor o problema do contratante.

Regras obrigatórias:
1. Nunca invente ou sugira uma categoria de serviço fora do catálogo acima. Se o \
relato do usuário não se encaixar em nenhuma delas, diga isso explicitamente e \
pergunte mais detalhes — não force um encaixe.
2. Sua pergunta de esclarecimento deve, sempre que possível, oferecer como opções \
os NOMES EXATOS das categorias do catálogo acima (ex.: "isso é mais sobre \
Financeiro / BPO, Tecnologia ou Manutenção Predial?") em vez de inventar subtemas, \
exemplos ou jargões que não estão na lista. Isso é essencial: se você sugerir um \
subtema que não é uma categoria do catálogo (como "emissão de notas fiscais" ou \
"gestão de contratos"), o usuário pode repetir esse termo e o classificador não vai \
reconhecê-lo, travando o diagnóstico.
3. Nunca mencione nota fiscal, arbitragem vinculante, ou qualquer coisa fora do \
escopo do MVP. O sistema real trata contrato digital, pagamento em custódia \
liberado só após aprovação do contratante, e reputação que só existe após \
transação concluída — pode mencionar isso como contexto, mas não invente números, \
prazos ou garantias que não foram informados.
4. Responda sempre em português, em tom direto e profissional, sem jargão \
desnecessário, e em no máximo 2-3 frases.
"""


def novo_historico():
    return [{"role": "system", "content": SYSTEM_PROMPT}]


def extrair_categoria(resposta: str):
    """Lê a linha 'Categoria: X' do briefing, se o agente já fechou o diagnóstico."""
    match = re.search(r"Categoria:\s*(.+)", resposta)
    if not match:
        return None
    categoria = match.group(1).strip()
    for c in CATALOGO:
        if c.lower() == categoria.lower():
            return c
    return None


def perguntar(historico):
    """Chama o modelo com o histórico completo e retorna a resposta em texto."""
    resposta = client.chat.completions.create(
        model=MODELO,
        messages=historico,
    )
    return resposta.choices[0].message.content


RESUMO_PROMPT = """Reescreva a conversa abaixo como um resumo curto (1-2 frases, \
até 240 caracteres) do problema que o contratante relatou, em português, em \
terceira pessoa, sem perguntas, sem repetir literalmente falas da conversa, \
sem saudações. Responda APENAS com o resumo, nada mais.

Conversa:
{conversa}
"""


def resumir(mensagens_usuario):
    """Gera um resumo curto e limpo do problema a partir das falas do usuário."""
    conversa = "\n".join(f"- {m['content']}" for m in mensagens_usuario)
    try:
        resposta = client.chat.completions.create(
            model=MODELO,
            messages=[
                {"role": "user", "content": RESUMO_PROMPT.format(conversa=conversa)}
            ],
        )
        resumo = resposta.choices[0].message.content.strip().strip('"')
        if resumo:
            return resumo
    except Exception:
        pass
    # Fallback determinístico caso a chamada ao modelo falhe.
    bruto = " ".join(m["content"] for m in mensagens_usuario).strip()
    return bruto[:237] + "..." if len(bruto) > 240 else bruto
