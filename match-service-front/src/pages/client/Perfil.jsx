import { useState } from "react";
import ProfileHeader from "../../components/perfil/ProfileHeader";
import PersonalDataCard from "../../components/perfil/PersonalDataCard";
import AddressCard from "../../components/perfil/AddressCard";
import useClientProfile from "../../context/useClientProfile";
import { mockProfile } from "../../data/profile";
import {
  validateProfile,
  maskPhone,
  maskCep,
} from "../../components/perfil/profileUtils";

/**
 * Perfil do cliente (/app/perfil). Funcionamento demonstrativo: os dados
 * vêm do cadastro da sessão (ClientProfileContext) ou, sem cadastro, são
 * fictícios (src/data/profile.js); as alterações salvas ficam só em
 * sessionStorage, durante a sessão da aba. Nada vai para o backend.
 *
 * Mesma filosofia single-screen das demais telas: compactação só a partir
 * de `xl` (1280px+); no mobile os cards empilham e a página rola.
 */
export default function Perfil() {
  // Fonte única compartilhada com Cadastro e Dashboard. Sem cliente
  // cadastrado na sessão, mostra os dados fictícios padrão.
  const { profile, updateProfile } = useClientProfile();
  const saved = profile ?? mockProfile;
  const [draft, setDraft] = useState(saved);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const values = editing ? draft : saved;

  function handleChange(field, value) {
    const masked =
      field === "phone" ? maskPhone(value) : field === "cep" ? maskCep(value) : value;
    setDraft((current) => ({ ...current, [field]: masked }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function handleEdit() {
    setDraft(saved);
    setErrors({});
    setSuccess(false);
    setEditing(true);
  }

  function handleCancel() {
    setDraft(saved);
    setErrors({});
    setEditing(false);
  }

  function handleSave() {
    const found = validateProfile(draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const cleaned = {
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      street: draft.street.trim(),
      number: draft.number.trim(),
      complement: draft.complement.trim(),
      district: draft.district.trim(),
      city: draft.city.trim(),
    };
    updateProfile(cleaned);
    setDraft(cleaned);
    setErrors({});
    setEditing(false);
    setSuccess(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 xl:gap-3">
      <ProfileHeader
        name={saved.name}
        editing={editing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400"
        >
          Alterações salvas com sucesso (demonstração — mantidas apenas durante esta sessão).
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch xl:gap-3">
        <PersonalDataCard values={values} errors={errors} editing={editing} onChange={handleChange} />
        <AddressCard values={values} errors={errors} editing={editing} onChange={handleChange} />
      </div>
    </div>
  );
}
