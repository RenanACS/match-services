import { useRef, useState } from "react";
import AdminDialog, { DialogTextarea } from "../../AdminDialog";
import AdminButton from "../../AdminButton";
import { DISPUTE_DECISIONS, MIN_TEXT } from "../../../../services/adminDisputes";

export const DEMO_NOTE = "Ação demonstrativa: é guardada apenas neste navegador, não é enviada a nenhum servidor.";

/** Confirmação de "Assumir análise". */
export function AssumeDialog({ dispute, onConfirm, onClose }) {
  return (
    <AdminDialog title="Assumir análise" icon="search" description={`Você passará a analisar a contestação #${dispute.id}. A situação muda de Aberta para Em análise.`} onClose={onClose}>
      <p className="adm-small text-cream/60">{DEMO_NOTE}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <AdminButton variant="secondary" onClick={onClose}>Cancelar</AdminButton>
        <AdminButton onClick={onConfirm}>Assumir análise</AdminButton>
      </div>
    </AdminDialog>
  );
}

/** Conclusão com decisão administrativa + justificativa obrigatória. NÃO executa operação financeira. */
export function ConcludeDialog({ dispute, onConfirm, onClose }) {
  const [decision, setDecision] = useState("");
  const [justification, setJustification] = useState("");
  const [errors, setErrors] = useState({});
  const fieldRef = useRef(null);

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!decision) next.decision = "Escolha a decisão administrativa.";
    const value = justification.trim();
    if (!value) next.justification = "Informe a justificativa da decisão.";
    else if (value.length < MIN_TEXT) next.justification = `Descreva a justificativa com ao menos ${MIN_TEXT} caracteres.`;
    setErrors(next);
    if (Object.keys(next).length === 0) onConfirm(decision, value);
  }

  return (
    <AdminDialog title="Concluir contestação" icon="gavel" wide description={`Registre a decisão administrativa da contestação #${dispute.id}.`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <fieldset>
          <legend className="adm-text font-medium text-cream">Decisão <span className="text-orange">*</span></legend>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
            {Object.entries(DISPUTE_DECISIONS).map(([key, label]) => (
              <label key={key} className={`adm-text flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition ${decision === key ? "border-orange bg-orange-soft text-cream" : "border-hairline text-cream/80 hover:border-orange/50"}`}>
                <input type="radio" name="decision" value={key} checked={decision === key} onChange={() => setDecision(key)} className="accent-[#FE5200]" />
                {label}
              </label>
            ))}
          </div>
          {errors.decision && <p role="alert" className="adm-small mt-1 text-red-400">{errors.decision}</p>}
        </fieldset>
        <DialogTextarea id="conclude-justification" label="Justificativa" required value={justification} onChange={setJustification} error={errors.justification} rows={3} placeholder="Explique o motivo da decisão." textareaRef={fieldRef} />
        <p className="adm-small rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-300">
          Registrar a decisão não reembolsa, estorna nem repassa nenhum valor, e não altera o pagamento nem o repasse. Essas operações dependerão da integração futura com o backend e o provedor financeiro. {DEMO_NOTE}
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <AdminButton variant="secondary" type="button" onClick={onClose}>Cancelar</AdminButton>
          <AdminButton type="submit">Registrar decisão</AdminButton>
        </div>
      </form>
    </AdminDialog>
  );
}
