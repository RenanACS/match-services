import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

/**
 * Tela de cadastro — só a interface, respeitando a assimetria de
 * documento do produto (fornecedor só CNPJ; contratante CPF ou CNPJ).
 * Sem envio real para o backend ainda.
 */
export default function Cadastro() {
  const [role, setRole] = useState("cliente");

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12 text-cream">
      <Card className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <img src={logo} alt="MATCH SERVICES" className="h-8 w-auto" />
          <span className="font-display text-sm font-semibold">
            MATCH SERVICES
          </span>
        </Link>

        <h1 className="font-display text-2xl font-semibold">Criar conta</h1>
        <p className="mt-1 text-sm text-cream/60">
          Fornecedores só podem se cadastrar com CNPJ.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {["cliente", "fornecedor"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              className={`min-h-[44px] rounded-xl border font-mono text-xs uppercase tracking-widest transition ${
                role === option
                  ? "border-orange bg-orange-soft text-orange"
                  : "border-hairline text-cream/60 hover:text-cream"
              }`}
            >
              {option === "cliente" ? "Sou cliente" : "Sou fornecedor"}
            </button>
          ))}
        </div>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input id="nome" label="Nome / Razão social" placeholder="" />
          <Input
            id="documento"
            label={role === "fornecedor" ? "CNPJ" : "CPF ou CNPJ"}
            placeholder={role === "fornecedor" ? "00.000.000/0000-00" : ""}
          />
          <Input id="email" label="E-mail" type="email" placeholder="voce@empresa.com" />
          <Input id="password" label="Senha" type="password" placeholder="••••••••" />
          <Button type="submit">Criar conta</Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/60">
          Já tem conta?{" "}
          <Link to="/login" className="text-orange hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
