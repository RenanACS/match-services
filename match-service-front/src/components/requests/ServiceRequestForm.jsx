import { useMemo, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import FileUpload from "./FileUpload";
import { suppliers, supplierCategories } from "../../data/suppliers";

// Demonstração de formulário. O envio real será integrado ao Django.
export default function ServiceRequestForm({ initialSupplierId = "" }) {
  const [mode, setMode] = useState(initialSupplierId ? "supplier" : "category");
  const [supplierId, setSupplierId] = useState(initialSupplierId);
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const selectedSupplier = useMemo(() => suppliers.find((s) => s.id === supplierId) || null, [supplierId]);
  const eligibleSuppliers = useMemo(() => suppliers.filter((s) => s.category === category), [category]);
  const availableServices = selectedSupplier?.services || [];

  function changeMode(nextMode) {
    setMode(nextMode);
    setErrors({});
    setSuccess(false);
  }
  function changeSupplier(nextId) {
    setSupplierId(nextId);
    setSuccess(false);
    const nextSupplier = suppliers.find((s) => s.id === nextId);
    if (!nextSupplier?.services.includes(service)) setService("");
  }
  function validate() {
    const e = {};
    if (mode === "supplier") {
      if (!selectedSupplier) e.supplierId = "Selecione um fornecedor.";
      if (!service || !selectedSupplier?.services.includes(service)) e.service = "Selecione um serviço oferecido pelo fornecedor.";
    } else if (!category || eligibleSuppliers.length === 0) {
      e.category = "Selecione uma categoria com fornecedores cadastrados.";
    }
    if (!description.trim()) e.description = "Descreva o serviço.";
    if (!location.trim()) e.location = "Informe o local do serviço.";
    if (!startDate) e.startDate = "Informe a data inicial.";
    if (!endDate) e.endDate = "Informe a data final.";
    if (startDate && endDate && endDate < startDate) e.endDate = "A data final não pode ser anterior à data inicial.";
    return e;
  }
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSuccess(Object.keys(nextErrors).length === 0);
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {success && (
        <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 app-text text-emerald-400">
          Solicitação validada (demonstração). {mode === "supplier"
            ? `Destinatário previsto: ${selectedSupplier.name}.`
            : `Destinatários previstos: ${eligibleSuppliers.length} fornecedor(es) da categoria ${category}.`}
          {" "}Nenhuma solicitação foi enviada de verdade.
        </div>
      )}
      <fieldset className="rounded-xl border border-hairline p-4">
        <legend className="app-text px-1 font-medium text-cream">Como deseja solicitar o serviço?</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${mode === "category" ? "border-orange bg-orange/10" : "border-hairline"}`}>
            <input type="radio" name="request-mode" checked={mode === "category"} onChange={() => changeMode("category")} className="mt-1 accent-orange" />
            <span><span className="app-text block font-medium text-cream">Por categoria</span><span className="app-small block text-cream/70">Para todos os fornecedores cadastrados nessa categoria.</span></span>
          </label>
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${mode === "supplier" ? "border-orange bg-orange/10" : "border-hairline"}`}>
            <input type="radio" name="request-mode" checked={mode === "supplier"} onChange={() => changeMode("supplier")} className="mt-1 accent-orange" />
            <span><span className="app-text block font-medium text-cream">Fornecedor específico</span><span className="app-small block text-cream/70">Escolher uma empresa e um serviço oferecido por ela.</span></span>
          </label>
        </div>
      </fieldset>
      {mode === "supplier" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Select appearance="app" id="request-supplier" label="Fornecedor" value={supplierId} onChange={(e) => changeSupplier(e.target.value)}>
              <option value="">Selecione um fornecedor</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            {errors.supplierId && <p className="app-small text-red-400">{errors.supplierId}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Select appearance="app" id="request-service" label="Serviço desejado" value={service} onChange={(e) => {setService(e.target.value); setSuccess(false);}} disabled={!selectedSupplier}>
              <option value="">{selectedSupplier ? "Selecione um serviço" : "Selecione um fornecedor primeiro"}</option>
              {availableServices.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            {errors.service && <p className="app-small text-red-400">{errors.service}</p>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <Select appearance="app" id="request-category" label="Categoria do serviço" value={category} onChange={(e) => {setCategory(e.target.value); setSuccess(false);}}>
            <option value="">Selecione uma categoria</option>
            {supplierCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          {errors.category && <p className="app-small text-red-400">{errors.category}</p>}
          {category && <p className="app-small mt-1 text-cream/70">{eligibleSuppliers.length} fornecedor(es) cadastrado(s) nessa categoria. O envio real dependerá do Django.</p>}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Textarea appearance="app" id="request-description" label="Descrição do serviço" rows={4} value={description} onChange={(e) => {setDescription(e.target.value); setSuccess(false);}} className="min-h-[88px]" />
        {errors.description && <p className="app-small text-red-400">{errors.description}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <Input appearance="app" id="request-location" label="Local do serviço" type="text" value={location} onChange={(e) => {setLocation(e.target.value); setSuccess(false);}} />
        {errors.location && <p className="app-small text-red-400">{errors.location}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Input appearance="app" id="request-start-date" label="Data inicial" type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value); setSuccess(false);}} />
          {errors.startDate && <p className="app-small text-red-400">{errors.startDate}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Input appearance="app" id="request-end-date" label="Data final" type="date" value={endDate} onChange={(e) => {setEndDate(e.target.value); setSuccess(false);}} />
          {errors.endDate && <p className="app-small text-red-400">{errors.endDate}</p>}
        </div>
      </div>
      <FileUpload file={file} onChange={(nextFile) => {setFile(nextFile); setSuccess(false);}} />
      <div><Button appearance="app" type="submit" variant="primary" size="lg" className="w-full sm:w-auto">Enviar solicitação</Button></div>
    </form>
  );
}
