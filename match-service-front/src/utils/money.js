// Conversão SEGURA de valores digitados em reais (padrão brasileiro) para
// CENTAVOS INTEIROS. Nunca usa ponto flutuante: a parte inteira e os centavos
// são lidos como texto, então não existe erro de arredondamento.
//
// Aceita: "1234", "1234,5", "1234,56", "1.234,56", "R$ 1.234,56".
// Recusa: vazio, negativos, letras, ponto como decimal ("12.5"), mais de duas
// casas decimais e números absurdamente grandes.

const FORMAT = /^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/;

/** @returns {{ ok: true, cents: number } | { ok: false, error: string }} */
export function parseMoneyToCents(input) {
  const raw = String(input ?? "").replace(/^R\$\s*/i, "").trim();
  if (!raw) return { ok: false, error: "Informe o valor." };
  if (raw.startsWith("-")) return { ok: false, error: "Valores negativos não são permitidos." };
  if (!FORMAT.test(raw)) return { ok: false, error: "Valor inválido. Use o formato 1.234,56." };
  const [intPart, decPart = ""] = raw.replace(/\./g, "").split(",");
  if (intPart.length > 10) return { ok: false, error: "Valor acima do limite aceito." };
  const cents = Number(intPart) * 100 + Number(decPart.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents)) return { ok: false, error: "Valor acima do limite aceito." };
  return { ok: true, cents };
}

/** Centavos inteiros -> texto editável "1.234,56" (para preencher campos). */
export function centsToInput(cents) {
  const value = Math.abs(Math.trunc(cents));
  const reais = String(Math.floor(value / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${reais},${String(value % 100).padStart(2, "0")}`;
}
