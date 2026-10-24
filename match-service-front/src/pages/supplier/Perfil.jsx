import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Avatar from "../../components/supplier/Avatar";
import FormField from "../../components/supplier/FormField";
import Notice from "../../components/supplier/Notice";
import PageHeader from "../../components/supplier/PageHeader";
import { EditIcon } from "../../components/supplier/icons";
import useSupplierData from "../../context/supplier/useSupplierData";
import useEntrega from "../../context/entrega/useEntrega";
import { SUPPLIER_CATEGORIES } from "../../data/fornecedor";
import { maskPhone } from "../../components/perfil/profileUtils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 3) errors.name = "Informe o nome da empresa.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Informe um e-mail válido.";
  if (values.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefone incompleto. Use DDD + número.";
  if (values.address.trim().length < 5) errors.address = "Informe o endereço.";
  if (!SUPPLIER_CATEGORIES.some((item) => item.label === values.category)) {
    errors.category = "Selecione a categoria de serviço.";
  }
  if (values.about.length > 300) errors.about = "A descrição pode ter no máximo 300 caracteres.";
  return errors;
}

function Info({ label, children }) {
  return (
    <div>
      <dt className="app-small font-medium text-cream/70">{label}</dt>
      <dd className="mt-1 text-cream">{children || <span className="text-cream/70">Não informado</span>}</dd>
    </div>
  );
}

/**
 * Perfil da empresa (/fornecedor/perfil): ver e editar. CNPJ e senha não são
 * exibidos nem guardados (mesma regra do cadastro).
 */
export default function SupplierProfile() {
  const { profile, updateProfile } = useSupplierData();
  const { resetEntrega } = useEntrega();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(profile);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  function startEditing() {
    setValues(profile);
    setErrors({});
    setNotice("");
    setEditing(true);
  }

  function change(field, format = (value) => value) {
    return (event) => {
      setValues((current) => ({ ...current, [field]: format(event.target.value) }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateProfile({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone,
      address: values.address.trim(),
      category: values.category,
      about: values.about.trim(),
    });
    setEditing(false);
    setNotice("Dados da empresa atualizados.");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title="Perfil da empresa"
        description="Estes dados aparecem para os clientes."
        actions={
          !editing && (
            <Button type="button" variant="secondary" onClick={startEditing}>
              <EditIcon width={16} height={16} />
              Editar dados
            </Button>
          )
        }
      />

      <Notice>{notice}</Notice>

      {editing ? (
        <Card>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField error={errors.name}>
                <Input id="profile-name" label="Nome da empresa" value={values.name} onChange={change("name")} />
              </FormField>
              <FormField error={errors.email}>
                <Input id="profile-email" label="E-mail" type="email" value={values.email} onChange={change("email")} />
              </FormField>
              <FormField error={errors.phone}>
                <Input
                  id="profile-phone"
                  label="Telefone"
                  type="tel"
                  value={values.phone}
                  onChange={change("phone", maskPhone)}
                />
              </FormField>
              <FormField error={errors.category}>
                <Select id="profile-category" label="Categoria de serviço" value={values.category} onChange={change("category")}>
                  <option value="">Selecione</option>
                  {SUPPLIER_CATEGORIES.map((item) => (
                    <option key={item.id} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField error={errors.address}>
              <Input id="profile-address" label="Endereço" value={values.address} onChange={change("address")} />
            </FormField>
            <FormField error={errors.about}>
              <Textarea
                id="profile-about"
                label="Sobre a empresa (opcional)"
                rows={4}
                value={values.about}
                onChange={change("about")}
              />
            </FormField>
            <p className="app-small text-cream/70">O CNPJ e a senha não são exibidos nem guardados nesta tela.</p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate app-section-title text-cream">{profile.name || "Sua empresa"}</p>
              <p className="app-text text-cream/70">{profile.category || "Categoria não informada"}</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Info label="E-mail">
              <span className="break-all">{profile.email}</span>
            </Info>
            <Info label="Telefone">{profile.phone}</Info>
            <Info label="Endereço">{profile.address}</Info>
            <Info label="Categoria de serviço">{profile.category}</Info>
          </dl>
          <h2 className="mt-6 app-small font-medium text-cream/70">Sobre a empresa</h2>
          <p className="mt-1 app-text text-cream/75">
            {profile.about || "Nenhuma descrição cadastrada. Use “Editar dados” para adicionar."}
          </p>
        </Card>
      )}

      <Card>
        <h2 className="app-section-title">Atalhos</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button as={Link} to="/fornecedor/servicos" variant="secondary">
            Meus serviços
          </Button>
          <Button as={Link} to="/fornecedor/avaliacoes" variant="secondary">
            Minhas avaliações
          </Button>
          <Button as={Link} to="/fornecedor" variant="ghost">
            Voltar ao dashboard
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="app-section-title">Demonstração</h2>
        <p className="mt-1 app-text text-cream/70">
          O fluxo "serviço concluído → pagamento liberado" é compartilhado com o cliente e não é apagado ao sair.
          Use o botão abaixo para zerá-lo e repetir o teste.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={() => {
            resetEntrega();
            setNotice("Fluxo de entrega reiniciado.");
          }}
        >
          Reiniciar fluxo de entrega
        </Button>
      </Card>
    </div>
  );
}
