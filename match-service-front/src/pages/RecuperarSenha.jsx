import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { requestPasswordRecovery } from "../services/passwordRecovery";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Recuperação de senha (/recuperar-senha) — pública e demonstrativa. Valida
 * o e-mail e mostra um aviso de que a solicitação foi apenas registrada de
 * forma demonstrativa; não envia e-mail e não guarda nada no navegador.
 * A chamada fica em services/passwordRecovery.js para ser trocada pelo
 * endpoint do Django no futuro.
 */
export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (error) setError("");
    if (message) setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const value = email.trim();
    if (!value) {
      setError("Informe seu e-mail.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await requestPasswordRecovery(value);
      setMessage(result.message);
    } catch {
      setError("Não foi possível registrar a solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-10 text-cream">
      <Card className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
          <span className="font-display text-sm font-semibold">MATCH SERVICES</span>
        </Link>

        <h1 className="font-display text-2xl font-semibold">Recuperar senha</h1>
        <p className="mt-1 text-sm text-cream/60">
          Informe seu e-mail cadastrado para receber as instruções de recuperação de senha.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              id="email"
              label="E-mail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "email-error" : undefined}
            />
            {error && (
              <p id="email-error" role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}
          </div>

          {message && (
            <p
              role="status"
              className="rounded-xl border border-orange/40 bg-orange-soft px-4 py-3 text-sm text-cream"
            >
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instruções"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/60">
          <Link to="/login" className="text-orange hover:underline">
            Voltar para o login
          </Link>
        </p>
      </Card>
    </div>
  );
}
