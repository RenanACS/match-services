import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

/**
 * Placeholder das telas do Admin ainda não implementadas. Só deixa a
 * navegação testável — sem formulários, tabelas ou regras de negócio.
 */
export default function AdminPlaceholder({ title, description }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div>
        <Badge variant="orange">Em desenvolvimento</Badge>
      </div>
      <h1 className="adm-page-title">{title}</h1>
      <Card>
        <p className="adm-text text-cream/70">{description}</p>
        <p className="mt-2 adm-text text-cream/50">
          Esta funcionalidade ainda está em desenvolvimento. A rota já existe para permitir testar a
          navegação do painel.
        </p>
      </Card>
    </div>
  );
}
