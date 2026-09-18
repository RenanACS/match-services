## Propósito

`match-service-front` — front-end do protótipo acadêmico **MATCH SERVICES**, um marketplace B2B de serviços com diagnóstico assistido por IA, demanda direta, contrato digital e pagamento em custódia.

Tem uma  landing page em React que apresenta o produto e inclui duas simulações interativas que rodam inteiramente no navegador, sem backend real ainda:

- **Diagnóstico assistido** — o usuário descreve um problema em texto livre e o sistema classifica contra um catálogo fechado de categorias.
- **Demanda direta** — formulário para publicar uma demanda já sabendo a categoria, com descrição e orçamento.

## Setup

Requisitos: Node.js 20+ e npm.

```bash
npm install
```

Rodando localmente:

```bash
npm run dev
```

Abre em `http://localhost:5173`.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o Oxlint sobre o código |

## Estrutura de Pastas

```
src/
├── assets/        # imagens, vídeo do hero, logo
├── components/    # componentes de seção da landing page
├── data/          # catálogo de categorias de serviço (dados estáticos)
├── App.jsx        # composição das seções na página
├── index.css      # design tokens (Tailwind @theme) e estilos globais
└── main.jsx       # entrypoint React
```

## Variáveis de Ambiente

Nenhuma é necessária — o projeto roda 100% no navegador, sem chamadas de rede. O `vite.config.js` inclui um proxy de `/api` para `http://127.0.0.1:8000` (backend Django do projeto, em `../backend`), mas nenhum componente atual usa esse proxy.

## Como Contribuir

- `src/index.css` é a fonte única de verdade para cor e tipografia — não crie valores hardcoded novos nos componentes.
- Mudou a UI? Atualize a documentação correspondente em `/docs` no mesmo PR.
- Rode `npm run lint` antes de abrir PR.

## Documentação relacionada

- [Design tokens](design-tokens.md) — cores, tipografia e espaçamento
- [Componentes documentados](components.md) — `Header`, `DiagnosisDemo`, `DemandForm`
- [Fluxo de navegação](fluxo-navegacao.md) — seções, âncoras e os dois fluxos de demonstração
