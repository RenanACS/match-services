import Button from "../ui/Button";
import { getInitials } from "./profileUtils";

export default function ProfileHeader({ name, editing, onEdit, onCancel, onSave }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:gap-3">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-orange/40 bg-orange-soft font-display text-lg font-semibold text-orange xl:h-12 xl:w-12 xl:text-base"
        >
          {getInitials(name)}
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl xl:text-2xl">
            Meu perfil
          </h1>
          <p className="mt-1 text-base text-cream/60 xl:text-sm">
            Gerencie suas informações pessoais e de contato
          </p>
        </div>
      </div>

      {editing ? (
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="secondary" size="md" className="xl:min-h-[38px]" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" size="md" className="xl:min-h-[38px]" onClick={onSave}>
            Salvar alterações
          </Button>
        </div>
      ) : (
        <Button type="button" variant="primary" size="md" className="shrink-0 xl:min-h-[38px]" onClick={onEdit}>
          Editar perfil
        </Button>
      )}
    </header>
  );
}
