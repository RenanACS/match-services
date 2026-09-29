import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import RoleToggle from "../components/auth/RoleToggle";
import PasswordField from "../components/auth/PasswordField";

const ROLE_OPTIONS = [
  { value: "cliente", label: "Quero contratar serviços" },
  { value: "fornecedor", label: "Quero oferecer serviços" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function maskCPF(digits) {
  return digits
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskCNPJ(digits) {
  return digits
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

// Cliente pode digitar CPF (11 dígitos) ou CNPJ (14) — a máscara se ajusta
// sozinha pela quantidade de dígitos. Fornecedor é sempre CNPJ.
function maskDocument(digits, role) {
  if (role === "fornecedor") return maskCNPJ(digits.slice(0, 14));
  return digits.length > 11 ? maskCNPJ(digits.slice(0, 14)) : maskCPF(digits.slice(0, 11));
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
  const [role, setRole] = useState("cliente");
  const [name, setName] = useState("");
  const [docValue, setDocValue] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const isFornecedor = role === "fornecedor";
  const nameLabel = isFornecedor ? "Razão social" : "Nome completo / Razão social";
  const documentLabel = isFornecedor ? "CNPJ" : "CPF / CNPJ";

  function handleRoleChange(nextRole) {
    setRole(nextRole);
    // Reaplica a máscara ao trocar de tipo (ex.: cliente com CPF de 11
    // dígitos virando fornecedor, que só aceita CNPJ de 14).
    setDocValue((current) => maskDocument(onlyDigits(current), nextRole));
  }

  function handleDocumentChange(event) {
    setDocValue(maskDocument(onlyDigits(event.target.value), role));
  }

  function validate() {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = isFornecedor ? "Informe a razão social." : "Informe o nome completo ou a razão social.";
    }

    const documentDigits = onlyDigits(docValue);
    if (!documentDigits) {
      nextErrors.document = isFornecedor ? "Informe o CNPJ." : "Informe o CPF ou CNPJ.";
    } else if (isFornecedor && documentDigits.length !== 14) {
      nextErrors.document = "Informe um CNPJ válido (14 dígitos).";
    } else if (!isFornecedor && documentDigits.length !== 11 && documentDigits.length !== 14) {
      nextErrors.document = "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.";
    }

    if (!address.trim()) nextErrors.address = "Informe o endereço.";
    if (!phone.trim()) nextErrors.phone = "Informe o telefone.";
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

    navigate(isFornecedor ? "/fornecedor" : "/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-10 text-cream">
      <Card className="w-full max-w-sm xl:p-3">
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

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4 xl:mt-2 xl:gap-1.5">
          <div className="flex flex-col gap-1.5 xl:gap-1">
            <Input
              id="name"
              label={nameLabel}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="xl:min-h-[38px] xl:py-1.5"
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5 xl:gap-1">
            <Input
              id="document"
              label={documentLabel}
              value={docValue}
              onChange={handleDocumentChange}
              inputMode="numeric"
              className="xl:min-h-[38px] xl:py-1.5"
            />
            {errors.document && <p className="text-xs text-red-400">{errors.document}</p>}
          </div>

          <div className="flex flex-col gap-1.5 xl:gap-1">
            <Input
              id="address"
              label="Endereço"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="xl:min-h-[38px] xl:py-1.5"
            />
            {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}
          </div>

          <div className="flex flex-col gap-1.5 xl:gap-1">
            <Input
              id="phone"
              label="Telefone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="xl:min-h-[38px] xl:py-1.5"
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
          </div>

          <div className="flex flex-col gap-1.5 xl:gap-1">
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="xl:min-h-[38px] xl:py-1.5"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5 xl:gap-1">
            <PasswordField
              id="password"
              label="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="xl:min-h-[38px] xl:py-1.5"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-2 text-xs text-cream/60">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline bg-surface-1 accent-orange"
              />
              <span>
                Li e aceito os{" "}
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="text-orange hover:underline"
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="text-orange hover:underline"
                >
                  Política de Privacidade
                </a>
                .
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}
          </div>

          <Button type="submit" className="w-full xl:min-h-[38px]">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/60 xl:mt-2">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-orange hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
