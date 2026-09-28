import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

/**
 * Página genérica para rotas já mapeadas no roteador mas cujo conteúdo
 * ainda não foi construído. Existe só para deixar a navegação testável
 * sem fingir uma funcionalidade que ainda não existe.
 */
export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col gap-4">
      <Badge variant="neutral">Em construção</Badge>
      <h1 className="font-display text-2xl font-semibold text-cream">
        {title}
      </h1>
      <Card>
        <p className="text-sm text-cream/60">
          Esta tela ainda não foi implementada — a rota já existe para que
          a navegação possa ser testada desde já.
        </p>
      </Card>
    </div>
  );
}
