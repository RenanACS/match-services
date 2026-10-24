import { useState } from "react";
import AdminButton from "../../components/admin/AdminButton";
import AdminSectionTitle from "../../components/admin/AdminSectionTitle";
import { loadDemoState, saveDemoState } from "../../utils/demoStorage";

const STORAGE_KEY = "matchservice.admin.profile.v1";
const DEFAULT_PROFILE = { name: "Administrador", phone: "", jobTitle: "Administração da plataforma" };
// E-mail e tipo de acesso NÃO são editáveis aqui (identidade e permissões vêm do backend).
const EMAIL = "admin@matchservice.exemplo.com.br";
const ACCESS = "Administrador (acesso de demonstração)";

function loadProfile() {
  const saved = loadDemoState(STORAGE_KEY, {});
  const text = (value, fallback) => (typeof value === "string" ? value : fallback);
  return {
    name: text(saved.name, DEFAULT_PROFILE.name) || DEFAULT_PROFILE.name,
    phone: text(saved.phone, DEFAULT_PROFILE.phone),
    jobTitle: text(saved.jobTitle, DEFAULT_PROFILE.jobTitle),
  };
}

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "A";

function Field({ id, label, value, onChange, error, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="adm-text font-medium text-cream">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="adm-filter mt-1.5 min-h-[40px] w-full rounded-xl border border-hairline bg-surface-2 px-3 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none"
        {...props}
      />
      {hint && !error && <p className="adm-small mt-1 text-cream/70">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="adm-small mt-1 text-red-400">{error}</p>}
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="adm-small text-cream/70">{label}</dt>
      <dd className="adm-text mt-0.5 truncate text-cream">{value}</dd>
    </div>
  );
}

/**
 * Perfil do administrador (/admin/perfil). Edição DEMONSTRATIVA de nome,
 * telefone e cargo (dados não sensíveis), guardada só neste navegador. O
 * e-mail e o tipo de acesso são apenas informativos: permissões não podem ser
 * alteradas aqui e não há troca de senha sem backend.
 */
export default function PerfilAdmin() {
  const [saved, setSaved] = useState(loadProfile);
  const [form, setForm] = useState(saved);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const dirty = form.name !== saved.name || form.phone !== saved.phone || form.jobTitle !== saved.jobTitle;
  const set = (key) => (value) => { setForm((f) => ({ ...f, [key]: value })); setFeedback(""); };

  function submit(event) {
    event.preventDefault();
    const name = form.name.trim();
    const next = {};
    if (name.length < 3) next.name = "Informe o nome com ao menos 3 caracteres.";
    if (form.phone && !/^[\d\s()+-]{8,20}$/.test(form.phone.trim())) next.phone = "Use apenas números, espaços, parênteses, + ou -.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const profile = { name, phone: form.phone.trim(), jobTitle: form.jobTitle.trim() };
    saveDemoState(STORAGE_KEY, profile);
    setSaved(profile);
    setForm(profile);
    setFeedback("Dados atualizados (demonstrativo: guardados só neste navegador, não enviados a nenhum servidor).");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header>
        <h1 className="adm-page-title">Perfil do administrador</h1>
      </header>

      <section aria-label="Resumo da conta" className="flex flex-wrap items-center gap-4 rounded-[20px] border border-hairline bg-surface-1 p-5">
        <span aria-hidden="true" className="adm-stat-number flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange">{initials(saved.name)}</span>
        <div className="min-w-0">
          <p className="adm-section-title truncate text-cream">{saved.name}</p>
          <p className="adm-text truncate text-cream/70">{saved.jobTitle || "Sem cargo informado"}</p>
          <span className="adm-badge mt-1.5 inline-flex rounded-full border border-orange/40 bg-orange-soft px-2 py-1 text-orange">Administrador</span>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} noValidate aria-labelledby="profile-edit" className="flex flex-col gap-4 rounded-[20px] border border-hairline bg-surface-1 p-5">
          <AdminSectionTitle id="profile-edit" icon="pencil">Editar dados</AdminSectionTitle>
          <Field id="profile-name" label="Nome" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
          <Field id="profile-job" label="Cargo ou função" value={form.jobTitle} onChange={set("jobTitle")} />
          <Field id="profile-phone" label="Telefone de contato (opcional)" value={form.phone} onChange={set("phone")} error={errors.phone} inputMode="tel" placeholder="(91) 90000-0000" />
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton type="submit" disabled={!dirty}>Salvar alterações</AdminButton>
            <AdminButton type="button" variant="secondary" disabled={!dirty} onClick={() => { setForm(saved); setErrors({}); }}>Descartar</AdminButton>
          </div>
          <p role="status" aria-live="polite" className="adm-small min-h-[16px] text-emerald-400">{feedback}</p>
        </form>

        <section aria-labelledby="profile-info" className="flex flex-col gap-3 rounded-[20px] border border-hairline bg-surface-1 p-5">
          <AdminSectionTitle id="profile-info" icon="shieldCheck">Informações da conta</AdminSectionTitle>
          <dl className="flex flex-col gap-3">
            <ReadOnly label="E-mail" value={EMAIL} />
            <ReadOnly label="Tipo de acesso" value={ACCESS} />
            <ReadOnly label="Ambiente" value="Demonstração (dados fictícios)" />
          </dl>
          <p className="adm-small rounded-xl border border-hairline bg-surface-2/60 px-3 py-2 text-cream/70">
            O e-mail e as permissões não podem ser alterados por esta tela, e não há troca de senha sem backend. Autenticação e permissões definitivas dependerão da integração com o Django.
          </p>
        </section>
      </div>
    </div>
  );
}
