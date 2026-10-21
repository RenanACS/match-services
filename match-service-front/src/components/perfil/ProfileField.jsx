import Input from "../ui/Input";
import Select from "../ui/Select";

const FIELD_CLASS = "disabled:cursor-default disabled:text-cream/70";

/**
 * Campo do perfil: Input/Select existentes + mensagem de erro logo abaixo.
 * Em modo leitura (`disabled`) o campo fica desabilitado, sem borda de foco.
 */
export default function ProfileField({ id, label, error, as = "input", children, ...props }) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1">
      {as === "select" ? (
        <Select appearance="app"
          id={id}
          label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={FIELD_CLASS}
          {...props}
        >
          {children}
        </Select>
      ) : (
        <Input appearance="app"
          id={id}
          label={label}
          fieldSize="md"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={FIELD_CLASS}
          {...props}
        />
      )}
      {error && (
        <p id={describedBy} role="alert" className="app-small text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
