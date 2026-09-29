import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import RoleToggle from "../components/auth/RoleToggle";
import PasswordField from "../components/auth/PasswordField";

const ROLE_OPTIONS = [
  { value: "cliente", label: "Sou cliente" },
  { value: "fornecedor", label: "Sou fornecedor" },
];

/**
 * Tela de login — só a interface, com navegação mock. Ainda não existe
 * autenticação real: não há API, backend, localStorage ou credenciais
 * fixas. Ao enviar, só validamos que e-mail e senha não estão vazios e
 * navegamos conforme o tipo de acesso escolhido (cliente → /app,
 * fornecedor → /fornecedor).
 */
export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Informe seu e-mail.";
    if (!password) nextErrors.password = "Informe sua senha.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    navigate(role === "fornecedor" ? "/fornecedor" : "/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-10 text-cream">
      <Card className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
          <span className="font-display text-sm font-semibold">
            MATCH SERVICES
          </span>
        </Link>

        <h1 className="font-display text-2xl font-semibold">Entrar</h1>
        <p className="mt-1 text-sm text-cream/60">
          Acesse sua conta para continuar.
        </p>

        <div className="mt-5">
          <RoleToggle options={ROLE_OPTIONS} value={role} onChange={setRole} />
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <PasswordField
              id="password"
              label="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="self-end text-xs text-cream/50 transition hover:text-orange"
            >
              Esqueci minha senha
            </a>
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/60">
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro" className="text-orange hover:underline">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
}
