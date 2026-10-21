import ProfileField from "./ProfileField";
import { DEMO_DOCUMENTS, PERSON_TYPE_LABELS } from "../../data/profile";

/**
 * Ordem dos campos: Nome completo, Tipo de pessoa, CPF/CNPJ, E-mail, Telefone.
 * Tipo de pessoa e CPF/CNPJ vêm do Cadastro e são sempre somente leitura,
 * inclusive no modo de edição.
 */
export default function PersonalDataCard({ values, errors, editing, onChange }) {
  const personType = values.personType === "PJ" ? "PJ" : "PF";
  const documentLabel = personType === "PJ" ? "CNPJ (demonstrativo)" : "CPF (demonstrativo)";
  const nameLabel = personType === "PJ" ? "Razão social" : "Nome completo";
  return (
    <section
      aria-labelledby="personal-title"
      className="flex flex-col rounded-[20px] border border-hairline bg-surface-1 p-4"
    >
      <h2 id="personal-title" className="app-section-title text-cream">
        Dados pessoais
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        <ProfileField
          id="profile-name"
          label={nameLabel}
          autoComplete="off"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          disabled={!editing}
          error={errors.name}
        />
        <ProfileField
          id="profile-person-type"
          label="Tipo de pessoa"
          value={PERSON_TYPE_LABELS[personType]}
          readOnly
          disabled
        />
        <ProfileField
          id="profile-document"
          label={documentLabel}
          value={DEMO_DOCUMENTS[personType]}
          readOnly
          disabled
        />
        <ProfileField
          id="profile-email"
          label="E-mail"
          type="email"
          autoComplete="off"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          disabled={!editing}
          error={errors.email}
        />
        <ProfileField
          id="profile-phone"
          label="Telefone"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="(00) 00000-0000"
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          disabled={!editing}
          error={errors.phone}
        />
      </div>
    </section>
  );
}
