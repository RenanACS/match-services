# MATCH SERVICES — Backend (Agente de Diagnóstico)

Registro do que foi feito na sessão de 2026-09-28, pra continuar depois sem
perder contexto.

## O que este backend é

É a implementação real (com LLM) do **Caminho A — Diagnóstico assistido** do
MATCH SERVICES: o contratante descreve um sintoma vago ("meu financeiro é
uma bagunça"), o agente faz até uma pergunta de esclarecimento, e fecha um
briefing estruturado indicando fornecedores fictícios da categoria certa.

O front-end (`match-service-front/src/data/catalog.js`) já tinha uma versão
puramente client-side (classificador por palavra-chave, sem LLM). Este
backend é a evolução disso: LLM pra conversa natural + o mesmo classificador
por palavra-chave pra garantir que o fechamento nunca sai do catálogo
fechado (ver "Decisão de arquitetura" abaixo).

## Arquivos

- `agent.py` — cliente OpenRouter, catálogo de 7 categorias, system prompt,
  `perguntar()` (chama o LLM) e `resumir()` (gera um resumo limpo de 1-2
  frases do problema do contratante).
- `catalog.py` — classificador determinístico por palavra-chave. Espelha
  `match-service-front/src/data/catalog.js` — **se mudar um, mude o outro**.
- `companies.py` — banco de 14 fornecedores fictícios (2 por categoria), com
  `id` (slug), nome, CNPJ fake, cidade, avaliação e descrição.
- `chatbot.py` — versão de terminal (`input()`/`print()`), usa a mesma
  lógica de fechamento determinístico que a API.
- `api.py` — API FastAPI (`POST /chat`, `GET /empresas/{id}`, `GET /health`)
  que o widget de chat do front consome.

## Decisão de arquitetura importante

O modelo free usado (`liquid/lfm-2.5-2.6b:free`, ver "Escolha do modelo"
abaixo) é pequeno e **não segue instrução de forma confiável** — em teste,
ele ignorou pedidos explícitos de fechar o diagnóstico e às vezes sugeria
subtemas ("emissão de notas fiscais") que não existem no catálogo,
confundindo o usuário e travando o fechamento.

Por isso, quem decide a categoria final e fecha o diagnóstico **nunca é o
LLM** — é sempre o classificador por palavra-chave em `catalog.py`
(`classificar()`), chamado a partir de `api.py`/`chatbot.py`. O LLM só
cuida da parte conversacional (a pergunta de esclarecimento e o resumo
final). Isso é bom, inclusive, porque reforça o próprio princípio do
produto: "catálogo fechado pra evitar alucinação" vira uma garantia
estrutural, não só uma instrução de prompt.

Fluxo de fechamento (em `api.py`/`chatbot.py`):
1. Junta todas as mensagens do usuário e roda `classificar()`.
2. Se achou categoria E (já são 2+ mensagens do usuário OU o usuário pediu
   pra fechar — "pode fechar", "não sei mais", etc.) → fecha
   deterministicamente: chama `resumir()` pra gerar o resumo limpo, monta a
   resposta natural, busca as empresas da categoria. Não chama o LLM nessa
   hora (mais rápido e 100% confiável).
3. Se não achou categoria com 2+ mensagens → avisa que não encontrou nada
   no catálogo (nunca inventa).
4. Caso contrário → chama o LLM só pra fazer a próxima pergunta de
   esclarecimento.

## Escolha do modelo

Começou com `nvidia/nemotron-3.5-lightning:free` (sugestão original) — muito
lento/instável no tier free (um teste ficou >10min sem responder).

Trocado para `liquid/lfm-2.5-2.6b:free` — bem mais rápido (2-10s por
resposta, variável), mas modelo pequeno com instrução fraca (daí a decisão
de arquitetura acima).

**Para produção/apresentação com mais orçamento**: considerar
`deepseek/deepseek-v4-flash` via OpenRouter — segue instrução muito melhor
e é praticamente de graça (~$0.08/1M tokens de entrada, ~$0.15/1M de
saída na tabela de preços consultada em 2026-09-28). Troca é só mudar
`MODELO` em `agent.py`. Ainda não trocado — decisão fica pra depois.

## Como rodar

```bash
# ambiente virtual já existe em backend/.venv — se precisar recriar:
python3 -m venv .venv
.venv/bin/pip install openai python-dotenv "fastapi[standard]" uvicorn

# terminal (chat simples, sem front)
.venv/bin/python chatbot.py

# API (pro widget de chat do front consumir)
.venv/bin/uvicorn api:app --reload
```

Precisa de um `.env` local (não versionado) com:
```
OPENROUTER_API_KEY=sk-or-...
```

## Front-end relacionado

- `match-service-front/src/components/ChatWidget.jsx` — ícone de chat
  flutuante na landing page, fala com `POST /chat`.
- `match-service-front/src/components/CompanyPage.jsx` — página de perfil
  de uma empresa fictícia, roteamento simples por hash (`#/empresa/<id>`,
  sem react-router), busca em `GET /empresas/{id}`.
- `match-service-front/src/data/catalog.js` — mesmas categorias/keywords de
  `backend/catalog.py`, mantidas sincronizadas manualmente.

## Pendências / próximos passos

- [ ] Decidir se troca pro DeepSeek (custo é insignificante, ganha
      confiabilidade — ver "Escolha do modelo").
- [ ] Testar o widget de chat no navegador de ponta a ponta (a extensão do
      Claude in Chrome não estava conectada nesta sessão, então só foi
      validado via `curl`/terminal).
- [ ] Se o catálogo mudar no front (`catalog.js`), replicar em
      `backend/catalog.py` — não há teste automático garantindo que os dois
      fiquem sincronizados.
- [ ] Avaliar se vale mover a API pra dentro do fluxo de deploy real do
      projeto (hoje só roda localmente com `uvicorn`).
