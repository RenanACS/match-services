from agent import SYSTEM_PROMPT, client, MODELO, perguntar, resumir
from catalog import classificar
from companies import buscar_por_categoria

historico = [{"role": "system", "content": SYSTEM_PROMPT}]
mensagens_usuario = []

print("Agente de Diagnóstico MATCH SERVICES pronto! Digite 'sair' para encerrar.\n")

FRASES_DE_FECHAMENTO = [
    "fecha", "pode fechar", "encerra", "é isso", "so isso", "só isso",
    "não sei mais", "nao sei mais", "finaliza",
]

while True:
    pergunta = input("Você: ").strip()
    if not pergunta:
        continue
    if pergunta.lower() == "sair":
        break

    historico.append({"role": "user", "content": pergunta})
    mensagens_usuario.append({"role": "user", "content": pergunta})

    texto_usuario = " ".join(m["content"] for m in mensagens_usuario)
    categoria = classificar(texto_usuario)
    pedido_fechamento = any(f in pergunta.lower() for f in FRASES_DE_FECHAMENTO)
    deve_fechar = categoria is not None and (
        len(mensagens_usuario) >= 2 or pedido_fechamento
    )

    try:
        if deve_fechar:
            resumo = resumir(mensagens_usuario)
            resposta = (
                f"Entendi — isso se encaixa em {categoria}. {resumo} "
                "Já separei fornecedores verificados por CNPJ nessa área, dá "
                "uma olhada nas opções abaixo."
            )
            print(f"Bot: {resposta}\n")
            for empresa in buscar_por_categoria(categoria):
                print(f"  - {empresa['nome']} ({empresa['cidade']}) — {empresa['descricao']}")
            print()
        elif categoria is None and len(mensagens_usuario) >= 2:
            resposta = (
                "Não encontrei nenhuma categoria do nosso catálogo fechado que "
                "corresponda ao que você descreveu. Isso é proposital: o agente "
                "não inventa serviços fora do catálogo. Pode tentar descrever de "
                "outra forma?"
            )
            print(f"Bot: {resposta}\n")
        else:
            resposta = perguntar(historico)
            print(f"Bot: {resposta}\n")

        historico.append({"role": "assistant", "content": resposta})

    except Exception as e:
        print(f"\nErro: {e}\n")
        historico.pop()
        mensagens_usuario.pop()
