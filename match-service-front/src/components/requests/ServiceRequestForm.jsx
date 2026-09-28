import { useMemo, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import FileUpload from "./FileUpload";
import { suppliers } from "../../data/suppliers";

/**
 * Formulário de Nova Solicitação (/app/solicitacao).
 * Dados 100% mockados — fornecedores vêm de src/data/suppliers.js e os
 * serviços disponíveis são os do fornecedor selecionado (supplier.services).
 * Não há envio real: ao validar com sucesso, só mostra a confirmação
 * visual "Solicitação enviada com sucesso." — a integração com o Django
 * fica para uma etapa futura.
 */
export default function ServiceRequestForm({ initialSupplierId = "" }) {
  const [supplierId, setSupplierId] = useState(initialSupplierId);
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const selectedSupplier = useMemo(
    () => suppliers.find((item) => item.id === supplierId) || null,
    [supplierId],
  );
  const availableServices = selectedSupplier?.services || [];

  function handleSupplierChange(nextId) {
    setSupplierId(nextId);
    const nextSupplier = suppliers.find((item) => item.id === nextId);
    // Se o serviço já escolhido não existe no novo fornecedor, limpa a
    // seleção em vez de manter um serviço que não corresponde a ele.
    if (!nextSupplier?.services.includes(service)) {
      setService("");
    }
  }

  function validate() {
    const nextErrors = {};
    if (!supplierId) nextErrors.supplierId = "Selecione um fornecedor.";
    if (!service) nextErrors.service = "Selecione um serviço.";
    if (!description.trim()) nextErrors.description = "Descreva o serviço.";
    if (!location.trim()) nextErrors.location = "Informe o local do serviço.";
    if (!startDate) nextErrors.startDate = "Informe a data inicial.";
    if (!endDate) nextErrors.endDate = "Informe a data final.";
    if (startDate && endDate && endDate < startDate) {
      nextErrors.endDate = "A data final não pode ser anterior à data inicial.";
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSuccess(Object.keys(nextErrors).length === 0);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 xl:gap-3">
      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
        >
          Solicitação enviada com sucesso.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 xl:gap-1">
          <Select
            id="request-supplier"
            label="Fornecedor"
            value={supplierId}
            onChange={(event) => handleSupplierChange(event.target.value)}
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          {errors.supplierId && (
            <p className="text-xs text-red-400">{errors.supplierId}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 xl:gap-1">
          <Select
            id="request-service"
            label="Serviço desejado"
            value={service}
            onChange={(event) => setService(event.target.value)}
            disabled={!selectedSupplier}
          >
            <option value="">
              {selectedSupplier ? "Selecione um serviço" : "Selecione um fornecedor primeiro"}
            </option>
            {availableServices.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          {errors.service && <p className="text-xs text-red-400">{errors.service}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 xl:gap-1">
        <Textarea
          id="request-description"
          label="Descrição do serviço"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="xl:h-20 xl:py-2"
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 xl:gap-1">
        <Input
          id="request-location"
          label="Local do serviço"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        {errors.location && <p className="text-xs text-red-400">{errors.location}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 xl:gap-1">
          <Input
            id="request-start-date"
            label="Data inicial"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          {errors.startDate && (
            <p className="text-xs text-red-400">{errors.startDate}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 xl:gap-1">
          <Input
            id="request-end-date"
            label="Data final"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
          {errors.endDate && <p className="text-xs text-red-400">{errors.endDate}</p>}
        </div>
      </div>

      <FileUpload file={file} onChange={setFile} />

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto xl:min-h-[46px] xl:px-6"
        >
          Enviar solicitação
        </Button>
      </div>
    </form>
  );
}
