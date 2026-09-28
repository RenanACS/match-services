import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-cream">
      <p className="font-mono text-xs uppercase tracking-widest text-orange">
        404
      </p>
      <h1 className="font-display text-3xl font-semibold">Página não encontrada</h1>
      <Link to="/">
        <Button variant="secondary">Voltar para o início</Button>
      </Link>
    </div>
  );
}
