# Zelo — Resumo do Projeto

> Nome provisório. Projeto de faculdade — disciplina de Gestão de Projetos de Software.

---

## O que é

Um marketplace B2B com **agente de diagnóstico por IA**, que conecta empresas que precisam de um serviço a empresas que prestam esse serviço — com contrato, pagamento e reputação, tudo dentro do app.

## O problema que resolve

Pequenas e médias empresas (e pessoas físicas contratando por conta própria) enfrentam três atritos ao contratar um serviço:

1. **Não sabem o que contratar.** Chegam com sintoma ("meu financeiro é uma bagunça"), não com diagnóstico ("preciso de BPO financeiro").
2. **Não sabem em quem confiar.** Cadastro de fornecedor com barreira baixa gera orçamentos ruins.
3. **Não têm segurança na transação.** Contrato e pagamento acontecem fora da plataforma — risco de calote dos dois lados.

**Referência de mercado:** o oHub (concorrente estudado) resolve só o "match" — conecta e sai de cena. Não garante entrega, não intermedia pagamento, não faz diagnóstico. É exatamente aí que o Zelo entra.

## Como funciona

O contratante tem **dois caminhos** pra criar uma demanda:

- **Caminho A — Diagnóstico assistido:** quem não sabe o que precisa conversa com o agente de IA, que faz perguntas guiadas (restritas a um catálogo fechado de serviços, pra não alucinar) e gera um briefing estruturado.
- **Caminho B — Demanda direta:** quem já sabe exatamente o serviço (ex.: limpeza de ar-condicionado) publica direto, com descrição e orçamento.

Dos dois caminhos em diante, o fluxo é o mesmo:

```
Demanda publicada → fornecedores enviam proposta → contratante compara
(avaliação + preço) → contrato digital gerado → pagamento em custódia
→ fornecedor entrega → contratante aprova → pagamento liberado → avaliação mútua
```

## Quem pode se cadastrar — regra assimétrica

| Papel | Documento aceito |
|---|---|
| **Fornecedor** (presta serviço) | Somente CNPJ |
| **Contratante** (contrata serviço) | CPF ou CNPJ |

Ou seja: quem vende é sempre empresa; quem compra pode ser pessoa física ou empresa. Cadastro é feito em uma única etapa, direto pelo documento — não existe conta "solta" sem CPF/CNPJ vinculado.

## Diferenciais frente ao concorrente

| | Marketplace comum (oHub) | Zelo |
|---|---|---|
| Descoberta da necessidade | Busca por palavra-chave | Agente de IA traduz sintoma em serviço |
| Contrato | Fora da plataforma | Gerado e assinado no app |
| Pagamento | Fora da plataforma | Custódia, liberada só após aprovação |
| Reputação | Inexistente | Só de quem concluiu uma transação real |

## Monetização

Taxa de transação (8–12%, sugerido) descontada do fornecedor na liberação do pagamento. Ideia em aberto: diferenciar taxa conforme o contratante seja CPF ou CNPJ.

## Fora do escopo do MVP (decisões deliberadas)

- Pessoa física como **fornecedora** de serviço — só CNPJ presta serviço.
- Emissão de nota fiscal / integração fiscal.
- Feed social, mediação avançada de disputas, videochamada nativa.

## Status atual dos entregáveis

| Documento | O que é |
|---|---|
| `Escopo_MVP.md` | Documento completo: 42 requisitos funcionais, regras de negócio, riscos, fluxos |
| `Modelo_Escopo_Entrega.md` | Versão condensada, no formato exigido pela disciplina (entrega de quarta) |
| `landing-zelo.html` | Protótipo de landing page — paleta preto + dourado, hero com o agente de diagnóstico |

## Em aberto (decisões da equipe)

- **Nome definitivo** — Zelo é provisório (alternativas: Trato, Aval, Sinal, Nexo).
- Se a taxa de transação muda conforme o contratante for CPF ou CNPJ.
- Categorias iniciais do catálogo pra focar no MVP (sugestão: Financeiro + Tecnologia).
