import { Link } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

/**
 * Tela de login — só a interface. Sem chamada real ao Django ainda
 * (isso virá quando a autenticação for implementada).
 */
export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-cream">
      <Card className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
          <span className="font-display text-sm font-semibold">
            MATCH SERVICES
          </span>
        </Link>

        <h1 className="font-display text-2xl font-semibold">Entrar</h1>
        <p className="mt-1 text-sm text-cream/60">
          Acesse sua conta de cliente ou fornecedor.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input id="email" label="E-mail" type="email" placeholder="voce@empresa.com" />
          <Input id="password" label="Senha" type="password" placeholder="••••••••" />
          <Button type="submit">Entrar</Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/60">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="text-orange hover:underline">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
}
