# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS with Tailwind CSS (via CDN, `forms` + `container-queries` plugins) and Google Fonts (Inter, JetBrains Mono). No build step, framework, or backend exists — `code.html` is a single self-contained file.

## Users

Two distinct sides of a B2B marketplace:

- **Contratante (buyer):** a small/medium business, or an individual hiring on their own behalf, that needs to hire a service. May register with CPF or CNPJ. Often arrives with a vague operational symptom rather than a clear service category in mind (e.g. "meu financeiro é uma bagunça" instead of "preciso de BPO financeiro").
- **Fornecedor (supplier):** a company that provides the service. Must register with CNPJ only — individuals cannot supply services on the platform (deliberate MVP exclusion).

## Product Purpose

A B2B marketplace with an AI diagnosis agent that connects companies needing a service to companies that provide it — with contract, payment, and reputation all handled inside the app. It exists to remove the three points of friction buyers face today: not knowing what to hire, not knowing who to trust, and having no transactional safety once a deal is agreed.

Success means a buyer can go from a vague symptom (or a known need) to a signed contract and an escrow-backed payment without leaving the platform, with reputation that only accrues from real completed transactions.

## Positioning

The named competitor (oHub) only solves the "match" step — connects buyer and supplier and exits. It does not diagnose the need, guarantee delivery, or intermediate payment. MATCH SERVICES's mechanism a keyword-search marketplace cannot copy without rebuilding itself: an AI agent that translates operational symptoms into a structured service brief (constrained to a closed service catalog to avoid hallucination), combined with in-app digital contracts and escrow that only releases payment after the buyer approves delivery.

## Operating Context

This landing page is a competition/pitch artifact, not just a product marketing page. It is being built for a college course deliverable in which teams compete internationally (against groups from other countries) and are evaluated by **Supernova**, a Brazilian company acting as an investor/evaluator: Supernova sees the website and the idea and decides whether it would invest. The primary near-term audience for this specific page is therefore Supernova and any competition judges, not yet real contratantes/fornecedores — it has to read as investor-grade and internationally competitive, not just usable.

Renan (the user) is the team lead and is building this landing page first so teammates can use it as the visual/reference anchor for the rest of the group's deliverables — the page functions as the de facto design system reference for the team, not only as a public-facing asset. This raises the bar on cohesion and polish: inconsistency here propagates into whatever teammates build from it.

The buyer has two entry paths into the same downstream flow:

- **Caminho A — Diagnóstico assistido:** buyer describes their problem in free text; the AI agent asks guided questions (restricted to a closed catalog of services) and produces a structured brief/scope.
- **Caminho B — Demanda direta:** buyer who already knows the exact service (e.g. AC cleaning) posts the demand directly with description and budget.

From either path, the flow converges:

```
Demanda publicada → fornecedores enviam proposta → contratante compara
(avaliação + preço) → contrato digital gerado → pagamento em custódia
→ fornecedor entrega → contratante aprova → pagamento liberado → avaliação mútua
```

Registration is single-step, directly by document (CPF/CNPJ) — there is no account that exists without a linked document.

## Capabilities and Constraints

- Fornecedor registration requires CNPJ only; contratante registration accepts CPF or CNPJ.
- The AI diagnosis agent is restricted to a closed/fixed service catalog by design, to prevent hallucinated scope.
- Contracts are generated and signed inside the app (not off-platform).
- Payment is held in escrow and released only after the buyer formally approves delivery.
- Reputation/reviews only accrue from completed real transactions (no reviews without a transaction).
- Monetization remains under study. A transaction fee charged to the supplier at payout is being considered, but no percentage or differentiated rule for CPF/CNPJ buyers is official yet.
- Explicitly out of MVP scope: individuals as suppliers (CNPJ-only sellers), invoice/fiscal (nota fiscal) integration, social feed, advanced dispute mediation, native video calling.
- The official catalog is intentionally multisegment, covering diverse business services such as technology, finance, cleaning, and additional categories as the marketplace expands.
- The definitive product and brand name is MATCH SERVICES.

## Brand Commitments

- **Definitive product name and brand: MATCH SERVICES.** This is the confirmed source of truth for all future product, design, and implementation work. The live landing-page prototype (`code.html`) and the dedicated logo asset (`match_services_logo_black_orange.png`) already use it.
- A separate project summary (`Resumo_Projeto.md`) refers to the product by the superseded provisional name "Zelo" (with alternatives Trato, Aval, Sinal, and Nexo also previously considered). Those names are historical references only and must not be used in new work.
- Existing visual identity in `code.html`: dark/near-black surface palette, "Swiss brutalist" typographic system (Inter for body, JetBrains Mono for tabular/technical labels), hairline borders and grid overlays, heavy use of institutional/compliance-flavored copy (audit IDs, protocol version numbers, regulatory language).
- Logo asset available at `match_services_logo_black_orange.png` (1024×1024, black background, orange mark).

## Evidence on Hand

- `Resumo_Projeto.md` — Portuguese-language project summary covering problem, mechanism, competitive comparison, monetization, and open team decisions. Written for an academic "Gestão de Projetos de Software" course deliverable, not a public-facing document.
- `code.html` — an existing, fairly developed landing-page prototype (dark B2B/institutional aesthetic) already expressing sections for: hero, the two entry paths, an "anti-chatbot" protocol walkthrough with a sample AI diagnosis transcript, a 4-stage purchase cycle, a comparison matrix vs. traditional B2B contracting, and a closing CTA.
- `match_services_logo_black_orange.png` — a produced logo asset for the MATCH SERVICES brand.
- `screen.png`, `6dfd26141ebfe393bbc1254698c02e3e.webp` — reference/incumbent screenshots and imagery already in the project; treat as existing visual evidence, not to be treated as stock filler.
- No real customers, testimonials, case studies, pricing page, or production traffic exist. This is a course deliverable/prototype, not a live product — future work must not fabricate customer proof, benchmarks, or usage numbers.

## Product Principles

1. **This page has to win a pitch, internationally.** The nearest evaluators are Supernova (a potential Brazilian investor) and competing student teams from other countries, not end-user buyers/suppliers yet. Every design decision should be pressure-tested against "would this read as investor-credible and internationally competitive," not just "is this usable."
2. **Diagnosis before discovery.** The product's core differentiation is translating a vague symptom into a precise, structured scope — this should stay central to any future work on the hero/entry flow, not be reduced to a generic "search" pattern.
3. **Trust is structural, not a badge.** Escrow, CNPJ verification, and transaction-gated reputation are the actual product, not decoration — copy and UI should keep making the mechanism visible (e.g. what's audited, what's held, what triggers release) rather than asserting vague "trust and safety."
4. **Asymmetric registration is a deliberate rule, not a bug.** Only CNPJ can supply; CPF or CNPJ can buy. Any future flow (registration, filters, copy) must preserve this asymmetry rather than smoothing it into a single generic account type.
5. **This is a prototype for an academic deliverable, not a live product.** No fabricated customers, press, benchmarks, or production claims — the comparison matrix and stats in `code.html` should be understood as illustrative/aspirational framing, not verified figures.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond ordinary web standards.
