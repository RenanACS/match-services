import Button from "../ui/Button";
import { getInitials } from "./profileUtils";

export default function ProfileHeader({ name, editing, onEdit, onCancel, onSave }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange/40 bg-orange-soft app-text font-semibold text-orange"
        >
          {getInitials(name)}
        </div>
        <div>
          <h1 className="app-page-title text-cream">
            Meu perfil
          </h1>
        </div>
      </div>

      {editing ? (
        <div className="flex shrink-0 gap-2">
          <Button appearance="app" type="button" variant="secondary" size="md" onClick={onCancel}>
            Cancelar
          </Button>
          <Button appearance="app" type="button" variant="primary" size="md" onClick={onSave}>
            Salvar alterações
          </Button>
        </div>
      ) : (
        <Button appearance="app" type="button" variant="primary" size="md" className="shrink-0" onClick={onEdit}>
          Editar perfil
        </Button>
      )}
    </header>
  );
}
