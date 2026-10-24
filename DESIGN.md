---
name: MATCH SERVICES
description: Marketplace B2B com custódia de pagamento, em interface escura de protocolo auditado com um único acento laranja.
colors:
  ink: "#0a0a0a"
  bg-app: "#070708"
  surface-1: "#0d0d0f"
  surface-2: "#121215"
  surface-3: "#18181c"
  charcoal: "#141414"
  charcoal-2: "#1c1c1c"
  hairline: "rgba(255, 255, 255, 0.1)"
  cream: "#f5f3ef"
  orange: "#fe5200"
  orange-light: "#ff8a47"
  orange-soft: "rgba(254, 82, 0, 0.16)"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  menu:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
rounded:
  md: "12px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.orange-light}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  nav-item-active:
    backgroundColor: "{colors.orange-soft}"
    textColor: "{colors.orange}"
    typography: "{typography.menu}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
---

# Design System: MATCH SERVICES

## Overview

**Creative North Star: "O Cofre Auditado"**

A interface se comporta como o produto promete: um registro verificável onde o dinheiro fica retido até a entrega ser aprovada. Superfícies quase pretas, bordas de um fio, tipografia técnica e um único laranja dão a sensação de protocolo e custódia, não de aplicativo de consumo. A confiança aparece na estrutura (identificadores, status, trilhas de atividade) e não em selos decorativos.

A landing pública é a vitrine para investidores e avaliadores e pode ser mais cinematográfica (foto escura, rede de nós, títulos grandes em Space Grotesk). As áreas internas (`/app`, `/fornecedor`, `/admin`) são ferramentas de operação: densas, previsíveis, com tamanhos de texto padronizados por área. Marca nos detalhes, não em ornamento.

**Key Characteristics:**
- Fundo quase preto em camadas tonais (`surface-1` a `surface-3`), sem sombras estruturais.
- Um único acento, o laranja, usado com parcimônia.
- Space Grotesk para títulos e números de destaque, Inter para todo o resto, JetBrains Mono apenas para identificadores técnicos.
- Bordas de um fio (`hairline`) em vez de preenchimento para separar blocos.
- Copy institucional em português, com tom de protocolo.

## Colors

Paleta de uma cor: tons neutros escuros e um laranja de alta saturação.

### Primary
- **Laranja Protocolo** (#fe5200): ação principal, item ativo de navegação, número que exige atenção e foco de teclado. Seu valor está na raridade.
- **Laranja Claro** (#ff8a47): estado hover do botão primário.
- **Laranja Velado** (rgba(254, 82, 0, 0.16)): fundo do item de menu ativo e de destaques suaves.

### Neutral
- **Tinta** (#0a0a0a): fundo da landing e cor do texto sobre o laranja.
- **Fundo do App** (#070708): fundo das telas internas.
- **Superfície 1 / 2 / 3** (#0d0d0f, #121215, #18181c): cartões, painéis e elevações por tom, do mais baixo ao mais alto.
- **Carvão** (#141414, #1c1c1c): superfícies da landing.
- **Fio** (rgba(255, 255, 255, 0.1)): todas as bordas e divisores.
- **Creme** (#f5f3ef): texto principal. Texto secundário usa creme com opacidade (45% a 70%).

### Named Rules
**A Regra do Acento Raro.** O laranja ocupa no máximo cerca de 10% de qualquer tela: a ação principal, o item ativo e o número crítico. Se tudo é laranja, nada é.

**A Regra do Status por Matiz.** Verde, vermelho e âmbar só comunicam estado (ativo, bloqueado, pendente) e sempre acompanham um texto. Nunca decoram.

## Typography

**Display Font:** Space Grotesk (com ui-sans-serif, system-ui)
**Body Font:** Inter (com ui-sans-serif, system-ui)
**Label/Mono Font:** JetBrains Mono

**Character:** Um grotesco geométrico para a voz da marca e um sans neutro para a leitura, com mono reservado a IDs e protocolos. Soa técnico e institucional.

### Hierarchy
- **Page title** (Space Grotesk 600, 22px, 28px, -0.01em): título de cada tela interna.
- **Section title** (Space Grotesk 600, 16px, 22px): títulos de blocos e cartões.
- **Stat number** (Space Grotesk 600, 20px, 24px): valores de indicadores.
- **Menu** (Inter 500, 14px, 20px): itens de navegação.
- **Body / table / button** (Inter 400-500, 13px, 18px): conteúdo, tabelas, filtros e botões.
- **Small / badge** (Inter 400-500, 12px, 16px): metadados e selos.
- **Eyebrow** (Inter 500, 11px, 0.08em, caixa alta): rótulos de grupo, como "ADMINISTRAÇÃO".

### Named Rules
**A Regra da Fonte Única de Tamanhos.** Cada área interna tem suas classes de tipografia (`adm-*` no admin, `app-*` no cliente). Telas usam essas classes e não tamanhos soltos do Tailwind.

**A Regra do Mono Técnico.** JetBrains Mono aparece apenas em identificadores e protocolos. Nunca em texto corrido.

## Layout

Telas internas usam sidebar fixa à esquerda a partir de `md`, cabeçalho fino com breadcrumb e uma coluna de conteúdo com cartões de indicadores no topo, filtros e tabelas abaixo. A densidade é alta e o ritmo vem de espaçamentos de 8 em 8 px. No celular, a sidebar vira menu e as tabelas viram listas de cartões (`*CardList`). A landing é uma página longa de seções de largura total com navegação em pílula no topo.

## Elevation & Depth

O sistema é plano e em camadas tonais. Profundidade vem da escala `surface-1` a `surface-3` e de bordas `hairline`, não de sombras. A única exceção é o `glass` da landing: fundo translúcido com desfoque de 12px sobre imagens.

### Named Rules
**A Regra do Plano por Padrão.** Superfícies são planas em repouso. Estado (hover, foco, seleção) muda cor ou borda, não adiciona sombra.

## Shapes

Cantos arredondados de 12px (`rounded-xl`) em botões, itens de menu, cartões e campos. Pílulas totalmente arredondadas na navegação e nos botões da landing. Bordas de um fio e um indicador de 2px à esquerda no item de menu ativo.

## Components

### Buttons
- **Shape:** 12px, altura mínima de 40px, sem caixa alta (Inter 13px, 500).
- **Primary:** fundo laranja, texto tinta. Hover clareia para laranja claro.
- **Secondary:** transparente, borda fio, hover com borda laranja a 60%.
- **Danger / Success:** contorno vermelho ou verde, fundo apenas no hover.
- **Foco:** contorno laranja de 2px com deslocamento de 2px (global).

### Navigation
Sidebar com ícone e rótulo. Item ativo: fundo laranja velado, texto laranja, indicador laranja de 2px à esquerda. Inativo: creme a 70%, hover em `surface-2`. Perfil e Sair ficam separados por uma borda no rodapé.

### Cards / Containers
Fundo `surface-1` ou `surface-2`, borda fio, cantos de 12px, sem sombra. Indicadores trazem rótulo no topo, ícone à direita e valor embaixo.

### Tables
Linhas com divisor fio, avatar ou ícone, selos de tipo e status, link "Detalhes" em laranja e ação textual. Paginação com página atual em laranja.

### Inputs / Fields
Campo com ícone de busca, borda fio e fundo escuro. Seletores com rótulo pequeno acima. O botão "Limpar filtros" é secundário com borda laranja.

## Do's and Don'ts

### Do:
- **Do** usar o laranja (#fe5200) somente para a ação principal, o item ativo e o número crítico.
- **Do** separar blocos com borda `hairline` e tom de superfície, não com sombra.
- **Do** usar as classes `adm-*` e `app-*` para texto interno, e Space Grotesk apenas em títulos e números.
- **Do** manter rótulos de status em texto junto da cor.
- **Do** preservar a assimetria do produto: só CNPJ fornece, CPF ou CNPJ contratam.

### Don't:
- **Don't** criar tamanhos de fonte soltos (`text-sm`, `text-xl`) nas telas internas.
- **Don't** usar texto corrido em JetBrains Mono.
- **Don't** adicionar cartões coloridos ou gradientes de acento nas telas de operação.
- **Don't** fabricar clientes, números de uso ou depoimentos: o projeto é um protótipo acadêmico.
- **Don't** usar o nome provisório "Zelo" ou variantes antigas; a marca é MATCH SERVICES.
