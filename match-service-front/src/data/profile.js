// Dados mockados do Perfil do Cliente (/app/perfil).
// Todos fictícios — nenhuma informação pessoal real. Quando o Django
// estiver pronto, `mockProfile` deve ser substituído pela resposta da API
// (src/services/ via api.js); o formato abaixo é o que a tela espera.

// Persistência demonstrativa: só dura a sessão da aba (sessionStorage).
export const PROFILE_STORAGE_KEY = "match-services:client-profile";

export const mockProfile = {
  name: "Cliente Exemplo",
  // Definido no Cadastro ("PF" = Pessoa Física, "PJ" = Pessoa Jurídica).
  personType: "PF",
  email: "cliente.exemplo@email.com",
  phone: "(91) 99999-0000",
  cep: "66000-000",
  street: "Rua Exemplo",
  number: "100",
  complement: "",
  district: "Centro",
  city: "Belém",
  state: "PA",
};

// Documentos FICTÍCIOS (dígitos verificadores válidos) exibidos no Perfil
// enquanto não há Django. O CPF/CNPJ digitado no Cadastro nunca é guardado
// no sessionStorage; com a API, o documento virá dos dados cadastrais.
export const DEMO_DOCUMENTS = {
  PF: "529.982.247-25",
  PJ: "11.222.333/0001-81",
};

export const PERSON_TYPE_LABELS = {
  PF: "Pessoa Física",
  PJ: "Pessoa Jurídica",
};

export const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];
