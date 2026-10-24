// Formata centavos (inteiro) como BRL. Valores monetários ficam em
// centavos nos dados para evitar erros de ponto flutuante em somas.
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatBRL(cents) {
  return BRL.format(cents / 100);
}
