import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import FormField from "../../components/supplier/FormField";
import PageHeader from "../../components/supplier/PageHeader";
import useSupplierData from "../../context/supplier/useSupplierData";
import { SUPPLIER_CATEGORIES } from "../../data/fornecedor";
import { parseMoney } from "../../utils/supplierFormat";

function formatInput(value) {
  return String(value).replace(".", ",");
}

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 3) errors.name = "Informe o nome do serviço (mínimo de 3 letras).";
  if (!SUPPLIER_CATEGORIES.some((item) => item.label === values.category)) {
    errors.category = "Selecione a categoria.";
  }
  const min = parseMoney(values.minPrice);
  const max = parseMoney(values.maxPrice);
  if (Number.isNaN(min) || min <= 0) errors.minPrice = "Informe o preço mínimo (maior que zero).";
  if (Number.isNaN(max) || max <= 0) errors.maxPrice = "Informe o preço máximo (maior que zero).";
  else if (!Number.isNaN(min) && max < min) errors.maxPrice = "O preço máximo não pode ser menor que o mínimo.";
  if (values.description.trim().length > 200) errors.description = "A descrição pode ter no máximo 200 caracteres.";
  return errors;
}

/** Cadastrar (/fornecedor/servicos/novo) e editar (/fornecedor/servicos/:id/editar) serviço. */
export default function SupplierServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, saveService } = useSupplierData();

  const editing = Boolean(id);
  const service = editing ? services.find((item) => item.id === id) : null;

  const [values, setValues] = useState(() => ({
    name: service?.name ?? "",
    category: service?.category ?? "",
    minPrice: service ? formatInput(service.minPrice) : "",
    maxPrice: service ? formatInput(service.maxPrice) : "",
    description: service?.description ?? "",
    active: service?.active ?? true,
  }));
  const [errors, setErrors] = useState({});

  if (editing && !service) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <PageHeader title="Serviço não encontrado" />
        <Card>
          <p className="text-sm text-cream/60">Esse serviço não existe mais na sua lista.</p>
          <Button as={Link} to="/fornecedor/servicos" variant="secondary" className="mt-4">
            Ver meus serviços
          </Button>
        </Card>
      </div>
    );
  }

  function change(field) {
    return (event) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveService(
      {
        name: values.name.trim(),
        category: values.category,
        minPrice: parseMoney(values.minPrice),
        maxPrice: parseMoney(values.maxPrice),
        description: values.description.trim(),
        active: values.active,
      },
      editing ? id : undefined,
    );
    navigate("/fornecedor/servicos");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={editing ? "Editar serviço" : "Novo serviço"}
        description="Esses dados aparecem para os clientes que buscam fornecedores."
      />

      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <FormField error={errors.name}>
            <Input id="service-name" label="Nome do serviço" value={values.name} onChange={change("name")} />
          </FormField>

          <FormField error={errors.category}>
            <Select id="service-category" label="Categoria" value={values.category} onChange={change("category")}>
              <option value="">Selecione</option>
              {SUPPLIER_CATEGORIES.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField error={errors.minPrice}>
              <Input
                id="service-min"
                label="Preço mínimo (R$)"
                inputMode="decimal"
                placeholder="0,00"
                value={values.minPrice}
                onChange={change("minPrice")}
              />
            </FormField>
            <FormField error={errors.maxPrice}>
              <Input
                id="service-max"
                label="Preço máximo (R$)"
                inputMode="decimal"
                placeholder="0,00"
                value={values.maxPrice}
                onChange={change("maxPrice")}
              />
            </FormField>
          </div>

          <FormField error={errors.description}>
            <Textarea
              id="service-description"
              label="Descrição (opcional)"
              rows={4}
              value={values.description}
              onChange={change("description")}
            />
          </FormField>

          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={values.active}
              onChange={(event) => setValues((current) => ({ ...current, active: event.target.checked }))}
              className="h-4 w-4 rounded border-hairline bg-surface-1 accent-orange"
            />
            Serviço ativo (visível para os clientes)
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button as={Link} to="/fornecedor/servicos" variant="secondary">
              Cancelar
            </Button>
            <Button type="submit">{editing ? "Salvar alterações" : "Cadastrar serviço"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
