import { BR_STATES } from "../../data/profile";

export function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

// (99) 99999-9999 ou (99) 9999-9999 — máscara simples, sem biblioteca.
export function maskPhone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Devolve um objeto { campo: "mensagem" }; vazio = tudo válido.
export function validateProfile(values) {
  const errors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Informe seu nome completo.";
  else if (name.length < 3) errors.name = "O nome deve ter ao menos 3 caracteres.";

  if (!values.email.trim()) errors.email = "Informe seu e-mail.";
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = "Informe um e-mail válido.";

  const phoneDigits = onlyDigits(values.phone);
  if (!phoneDigits) errors.phone = "Informe seu telefone.";
  else if (phoneDigits.length < 10) errors.phone = "Telefone incompleto. Use DDD + número.";

  const cepDigits = onlyDigits(values.cep);
  if (!cepDigits) errors.cep = "Informe o CEP.";
  else if (cepDigits.length !== 8) errors.cep = "CEP deve ter 8 dígitos.";

  if (!values.street.trim()) errors.street = "Informe o logradouro.";
  if (!values.number.trim()) errors.number = "Informe o número.";
  if (!values.district.trim()) errors.district = "Informe o bairro.";
  if (!values.city.trim()) errors.city = "Informe a cidade.";
  if (!BR_STATES.includes(values.state)) errors.state = "Selecione o estado.";
  // complemento é opcional
  return errors;
}
