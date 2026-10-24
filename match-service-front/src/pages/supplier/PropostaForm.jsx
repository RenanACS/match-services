import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import FormField from "../../components/supplier/FormField";
import PageHeader from "../../components/supplier/PageHeader";
import useSupplierData from "../../context/supplier/useSupplierData";
import { parseMoney } from "../../utils/supplierFormat";

function validate(values) {
  const errors = {};
  if (values.client.trim().length < 3) errors.client = "Informe o nome do cliente.";
  if (values.service.trim().length < 3) errors.service = "Informe o serviço (mínimo de 3 letras).";
  const value = parseMoney(values.value);
  if (Number.isNaN(value) || value <= 0) errors.value = "Informe um valor maior que zero. Ex.: 1.500,00";
  const days = Number(values.days);
  if (!Number.isInteger(days) || days < 1 || days > 365) errors.days = "Informe o prazo em dias (de 1 a 365).";
  if (values.description.trim().length < 10) errors.description = "Descreva a proposta (mínimo de 10 caracteres).";
  return errors;
}

/**
 * Criar (/fornecedor/propostas/nova) e editar (/fornecedor/propostas/:id/editar)
 * proposta. Ao vir de uma solicitação (?solicitacao=2860), já preenche
 * cliente, serviço e valor. Só propostas "Enviada" podem ser editadas.
 */
export default function SupplierProposalForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { proposals, requests, saveProposal } = useSupplierData();

  const editing = Boolean(id);
  const proposal = editing ? proposals.find((item) => item.id === id) : null;
  const sourceRequest = !editing ? requests.find((item) => item.id === searchParams.get("solicitacao")) : null;

  const [values, setValues] = useState(() => ({
    client: proposal?.client ?? sourceRequest?.client.name ?? "",
    service: proposal?.service ?? sourceRequest?.service ?? "",
    value: proposal ? String(proposal.value).replace(".", ",") : sourceRequest ? String(sourceRequest.value) : "",
    days: proposal ? String(proposal.days) : "",
    description: proposal?.description ?? sourceRequest?.description ?? "",
  }));
  const [errors, setErrors] = useState({});

  if (editing && (!proposal || proposal.status !== "sent")) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <PageHeader title={proposal ? "Proposta não editável" : "Proposta não encontrada"} />
        <Card>
          <p className="text-sm text-cream/60">
            {proposal
              ? 'Só propostas com status "Enviada" podem ser editadas.'
              : `Não existe uma proposta com o número #${id}.`}
          </p>
          <Button as={Link} to={proposal ? `/fornecedor/propostas/${id}` : "/fornecedor/propostas"} variant="secondary" className="mt-4">
            {proposal ? "Ver proposta" : "Ver todas as propostas"}
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

    const savedId = saveProposal(
      {
        client: values.client.trim(),
        service: values.service.trim(),
        value: parseMoney(values.value),
        days: Number(values.days),
        description: values.description.trim(),
        ...(editing ? {} : { requestId: sourceRequest?.id ?? null }),
      },
      editing ? id : undefined,
    );
    navigate(`/fornecedor/propostas/${savedId}`);
  }

  const cancelTo = editing ? `/fornecedor/propostas/${id}` : "/fornecedor/propostas";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={editing ? `Editar proposta #${id}` : "Nova proposta"}
        description={
          sourceRequest
            ? `Proposta para a solicitação #${sourceRequest.id}. Confira os dados pré-preenchidos.`
            : "Preencha os dados da proposta que será enviada ao cliente."
        }
      />

      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField error={errors.client}>
              <Input id="proposal-client" label="Cliente" value={values.client} onChange={change("client")} />
            </FormField>
            <FormField error={errors.service}>
              <Input id="proposal-service" label="Serviço" value={values.service} onChange={change("service")} />
            </FormField>
            <FormField error={errors.value}>
              <Input
                id="proposal-value"
                label="Valor (R$)"
                inputMode="decimal"
                placeholder="0,00"
                value={values.value}
                onChange={change("value")}
              />
            </FormField>
            <FormField error={errors.days}>
              <Input
                id="proposal-days"
                label="Prazo (dias)"
                inputMode="numeric"
                placeholder="Ex.: 15"
                value={values.days}
                onChange={change("days")}
              />
            </FormField>
          </div>
          <FormField error={errors.description}>
            <Textarea
              id="proposal-description"
              label="Descrição"
              rows={5}
              value={values.description}
              onChange={change("description")}
            />
          </FormField>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button as={Link} to={cancelTo} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit">{editing ? "Salvar alterações" : "Enviar proposta"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
