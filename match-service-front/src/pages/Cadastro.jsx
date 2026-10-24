import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import RoleToggle from "../components/auth/RoleToggle";
import PasswordField from "../components/auth/PasswordField";
import { onlyDigits, maskCPF, maskCNPJ, isValidCPF, isValidCNPJ } from "../utils/documents";
import Select from "../components/ui/Select";
import { BR_STATES } from "../data/profile";
import { maskPhone, maskCep } from "../components/perfil/profileUtils";
import useClientProfile from "../context/useClientProfile";

const ROLE_OPTIONS = [
  { value: "cliente", label: "Quero contratar serviços" },
  { value: "fornecedor", label: "Quero oferecer serviços" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERSON_TYPE_OPTIONS = [
  { value: "PF", label: "Pessoa Física" },
  { value: "PJ", label: "Pessoa Jurídica" },
];

// Cliente: a máscara segue o tipo de pessoa escolhido (PF = CPF, PJ = CNPJ).
// Fornecedor é sempre CNPJ.
function maskDocument(value, role, personType) {
  const digits = onlyDigits(value);
  return role === "fornecedor" || personType === "PJ" ? maskCNPJ(digits) : maskCPF(digits);
}

/**
 * Tela de cadastro — só a interface da conta, com navegação mock. O
 * formulário muda de acordo com o tipo de conta: cliente pode ser pessoa
 * física ou jurídica (CPF ou CNPJ); fornecedor é sempre uma empresa
 * (CNPJ). O CNPJ informado aqui não passa por nenhuma verificação real —
 * a triagem do fornecedor é uma etapa futura. Sem backend, sem
 * persistência real.
 */
export default function Cadastro() {
  const navigate = useNavigate();
  const { register, clear } = useClientProfile();
  const [role, setRole] = useState("cliente");
  const [personType, setPersonType] = useState("PF");
  const [name, setName] = useState("");
  const [docValue, setDocValue] = useState("");
  const [address, setAddress] = useState(""); // fornecedor: endereço em texto livre
  const [addr, setAddr] = useState({
    cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
  });
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const isFornecedor = role === "fornecedor";
  const isPJ = isFornecedor || personType === "PJ";
  const nameLabel = isPJ ? "Razão social" : "Nome completo";
  const documentLabel = isPJ ? "CNPJ" : "CPF";

  function handleRoleChange(nextRole) {
    setRole(nextRole);
    // Reaplica a máscara ao trocar de tipo (ex.: cliente com CPF de 11
    // dígitos virando fornecedor, que só aceita CNPJ de 14).
    setDocValue((current) => maskDocument(current, nextRole, personType));
    setErrors((current) => ({ ...current, name: undefined, document: undefined }));
  }

  function handlePersonTypeChange(nextType) {
    setPersonType(nextType);
    // CPF e CNPJ têm tamanhos diferentes: limpa o documento para não
    // misturar máscaras e remove os erros dependentes do tipo.
    setDocValue("");
    setErrors((current) => ({ ...current, name: undefined, document: undefined }));
  }

  function handleAddrChange(field, value) {
    setAddr((current) => ({ ...current, [field]: field === "cep" ? maskCep(value) : value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function handleDocumentChange(event) {
    setDocValue(maskDocument(event.target.value, role, personType));
  }

  function validate() {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = isPJ ? "Informe a razão social." : "Informe o nome completo.";
    }

    const documentDigits = onlyDigits(docValue);
    if (!documentDigits) {
      nextErrors.document = isPJ ? "Informe o CNPJ." : "Informe o CPF.";
    } else if (isFornecedor) {
      // Fornecedor: triagem real do CNPJ é etapa futura — só confere o tamanho.
      if (documentDigits.length !== 14) nextErrors.document = "Informe um CNPJ válido (14 dígitos).";
    } else if (personType === "PF" && !isValidCPF(documentDigits)) {
      nextErrors.document = "Informe um CPF válido (11 dígitos).";
    } else if (personType === "PJ" && !isValidCNPJ(documentDigits)) {
      nextErrors.document = "Informe um CNPJ válido (14 dígitos).";
    }

    if (isFornecedor) {
      if (!address.trim()) nextErrors.address = "Informe o endereço.";
    } else {
      const cepDigits = onlyDigits(addr.cep);
      if (!cepDigits) nextErrors.cep = "Informe o CEP.";
      else if (cepDigits.length !== 8) nextErrors.cep = "CEP deve ter 8 dígitos.";
      if (!addr.street.trim()) nextErrors.street = "Informe o logradouro.";
      if (!addr.number.trim()) nextErrors.number = "Informe o número.";
      if (!addr.district.trim()) nextErrors.district = "Informe o bairro.";
      if (!addr.city.trim()) nextErrors.city = "Informe a cidade.";
      if (!BR_STATES.includes(addr.state)) nextErrors.state = "Selecione o estado.";
    }
    if (!phone.trim()) nextErrors.phone = "Informe o telefone.";
    else if (!isFornecedor && onlyDigits(phone).length < 10) {
      nextErrors.phone = "Telefone incompleto. Use DDD + número.";
    }
    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Informe um e-mail válido.";
    }
    if (!password) nextErrors.password = "Informe uma senha.";
    if (!acceptedTerms) {
      nextErrors.terms = "É preciso aceitar os Termos de Uso e a Política de Privacidade.";
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isFornecedor) {
      // Cadastro de fornecedor não deve deixar um cliente anterior na sessão.
      clear();
    } else {
      // Demonstração enquanto não há Django: o cadastro vira a fonte única
      // (ClientProfileContext) com SOMENTE dados não sensíveis. CPF/CNPJ e
      // senha ficam fora — o Perfil mostra um documento fictício.
      register({
        personType,
        name: name.trim(),
        email: email.trim(),
        phone: maskPhone(phone),
        cep: addr.cep,
        street: addr.street.trim(),
        number: addr.number.trim(),
        complement: addr.complement.trim(),
        district: addr.district.trim(),
        city: addr.city.trim(),
        state: addr.state,
      });
    }

    navigate(isFornecedor ? "/fornecedor" : "/app");
  }

  const fieldClass = "xl:min-h-[38px] xl:py-1.5";
  const wrap = "flex flex-col gap-1.5 xl:gap-1";

  const nameField = (
    <div className={wrap}>
      <Input id="name" label={nameLabel} value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
      {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
    </div>
  );

  const documentField = (
    <div className={wrap}>
      <Input id="document" label={documentLabel} value={docValue} onChange={handleDocumentChange} inputMode="numeric" className={fieldClass} />
      {errors.document && <p className="text-xs text-red-400">{errors.document}</p>}
    </div>
  );

  const addressTextField = (
    <div className={wrap}>
      <Input id="address" label="Endereço" value={address} onChange={(event) => setAddress(event.target.value)} className={fieldClass} />
      {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}
    </div>
  );

  const phoneField = (
    <div className={wrap}>
      <Input
        id="phone"
        label="Telefone"
        type="tel"
        value={phone}
        onChange={(event) => setPhone(isFornecedor ? event.target.value : maskPhone(event.target.value))}
        className={fieldClass}
      />
      {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
    </div>
  );

  const emailField = (
    <div className={wrap}>
      <Input id="email" label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
    </div>
  );

  const passwordField = (
    <div className={wrap}>
      <PasswordField id="password" label="Senha" value={password} onChange={(event) => setPassword(event.target.value)} className={fieldClass} />
      {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
    </div>
  );

  const termsField = (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-2 text-xs text-cream/70">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline bg-surface-1 accent-orange"
        />
        <span>
          Li e aceito os{" "}
          <a href="#" onClick={(event) => event.preventDefault()} className="text-orange hover:underline">
            Termos de Uso
          </a>{" "}
          e a{" "}
          <a href="#" onClick={(event) => event.preventDefault()} className="text-orange hover:underline">
            Política de Privacidade
          </a>
          .
        </span>
      </label>
      {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}
    </div>
  );

  function addrInput(field, label, extra = {}) {
    return (
      <div className={wrap}>
        <Input
          id={field}
          label={label}
          autoComplete="off"
          value={addr[field]}
          onChange={(event) => handleAddrChange(field, event.target.value)}
          className={fieldClass}
          {...extra}
        />
        {errors[field] && <p className="text-xs text-red-400">{errors[field]}</p>}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-10 text-cream xl:py-3">
      <Card className={`w-full xl:p-3 ${isFornecedor ? "max-w-sm" : "max-w-sm md:max-w-3xl"}`}>
        <Link to="/" className="mb-6 flex items-center gap-2 xl:mb-2">
          <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
          <span className="font-display text-sm font-semibold">
            MATCH SERVICES
          </span>
        </Link>

        <h1 className="font-display text-2xl font-semibold">Crie sua conta</h1>

        <div className="mt-5 xl:mt-3">
          <RoleToggle options={ROLE_OPTIONS} value={role} onChange={handleRoleChange} />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 flex flex-col gap-4 xl:mt-2 xl:gap-1.5"
        >
          {isFornecedor ? (
            <>
              {nameField}
              {documentField}
              {addressTextField}
              {phoneField}
              {emailField}
              {passwordField}
              {termsField}
            </>
          ) : (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-x-6 xl:gap-x-5">
              <div className="flex flex-col gap-4 xl:gap-1.5">
                <div role="group" aria-label="Tipo de pessoa">
                  <RoleToggle options={PERSON_TYPE_OPTIONS} value={personType} onChange={handlePersonTypeChange} />
                </div>
                {nameField}
                {documentField}
                {emailField}
                {phoneField}
                {passwordField}
              </div>
              <div className="flex flex-col gap-4 xl:gap-1.5">
                <div className="grid grid-cols-2 gap-3">
                  {addrInput("cep", "CEP", { inputMode: "numeric", placeholder: "00000-000" })}
                  {addrInput("number", "Número")}
                </div>
                {addrInput("street", "Logradouro")}
                {addrInput("complement", "Complemento (opcional)")}
                {addrInput("district", "Bairro")}
                <div className="grid grid-cols-[1fr_6rem] gap-3">
                  {addrInput("city", "Cidade")}
                  <div className="flex flex-col gap-1.5 xl:gap-1">
                    <Select
                      id="state"
                      label="UF"
                      value={addr.state}
                      onChange={(event) => handleAddrChange("state", event.target.value)}
                      className="xl:min-h-[38px] xl:py-1.5"
                    >
                      <option value="">UF</option>
                      {BR_STATES.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </Select>
                    {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
                  </div>
                </div>
                {termsField}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full xl:min-h-[38px] md:mx-auto md:max-w-sm">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/70 xl:mt-2">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-orange hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
