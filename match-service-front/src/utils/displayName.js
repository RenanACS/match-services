// Identificação curta para saudações. PF: primeiro nome. PJ: as duas
// primeiras palavras da razão social, sem sufixos societários.
const LEGAL_SUFFIX = /^(ltda|me|epp|eireli|mei|sa|ss|cia)$/;

export function getShortName(name, personType) {
  const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (personType !== "PJ") return words[0];
  const core = words.filter((w) => !LEGAL_SUFFIX.test(w.toLowerCase().replace(/[.,/]/g, "")));
  return (core.length ? core : words).slice(0, 2).join(" ");
}
