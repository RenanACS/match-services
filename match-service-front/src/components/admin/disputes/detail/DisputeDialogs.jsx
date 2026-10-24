import { useRef, useState } from "react";
import AdminDialog, { DialogTextarea } from "../../AdminDialog";
import AdminButton from "../../AdminButton";
import DisputeResolutionSummary from "./DisputeResolutionSummary";
import { DISPUTE_DECISIONS } from "../../../../services/adminDisputes";
import { REFUND_TYPES, emptyFields, validateResolution } from "../../../../services/disputeFinancials";
import { formatBRL } from "../../../../utils/currency";
import { parseMoneyToCents } from "../../../../utils/money";

export const DEMO_NOTE = "Ação demonstrativa: é guardada apenas neste navegador, não é enviada a nenhum servidor.";

/** Confirmação de "Assumir análise". */
export function AssumeDialog({ dispute, onConfirm, onClose }) {
  return (
    <AdminDialog title="Assumir análise" icon="search" description={`Você passará a analisar a contestação #${dispute.id}. A situação muda de Aberta para Em análise.`} onClose={onClose}>
      <p className="adm-small text-cream/70">{DEMO_NOTE}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <AdminButton variant="secondary" onClick={onClose}>Cancelar</AdminButton>
        <AdminButton onClick={onConfirm}>Assumir análise</AdminButton>
      </div>
    </AdminDialog>
  );
}

const STEPS = [
  { key: "decision", label: "Decisão" },
  { key: "financial", label: "Resolução financeira" },
  { key: "justification", label: "Justificativa" },
  { key: "review", label: "Revisão" },
];

const inputClass = "adm-text mt-1.5 w-full rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-cream placeholder:text-cream/70 focus:border-orange focus:outline-none";

function Choice({ name, value, current, onChange, children }) {
  return (
    <label className={`adm-text flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition ${current === value ? "border-orange bg-orange-soft text-cream" : "border-hairline text-cream/80 hover:border-orange/50"}`}>
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} className="accent-[#FE5200]" />
      {children}
    </label>
  );
}

function MoneyField({ id, label, value, onChange, error, hint }) {
  return (
    <div>
      <label htmlFor={id} className="adm-text font-medium text-cream">{label} <span className="text-orange">*</span></label>
      <input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} placeholder="0,00" onChange={(e) => onChange(e.target.value)} aria-invalid={error ? "true" : undefined} aria-describedby={error ? `${id}-error` : undefined} className={inputClass} />
      {hint && <p className="adm-small mt-1 text-cream/70">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="adm-small mt-1 text-red-400">{error}</p>}
    </div>
  );
}

function Confirm({ id, checked, onChange, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="adm-text flex cursor-pointer items-start gap-2.5 rounded-xl border border-hairline px-3 py-2 text-cream/90">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 accent-[#FE5200]" />
        <span>{children}</span>
      </label>
      {error && <p role="alert" className="adm-small mt-1 text-red-400">{error}</p>}
    </div>
  );
}

/**
 * Conclusão da contestação em 4 etapas: 1 decisão, 2 resolução financeira
 * (campos conforme a decisão), 3 justificativa, 4 revisão e confirmação
 * explícita. TUDO é demonstrativo: registrar a decisão e a destinação NÃO
 * reembolsa, estorna nem repassa nada e não muda o pagamento. `balance` vem
 * de getAvailableBalance (saldo realmente retido); sem saldo, decisões com
 * valores ficam bloqueadas, sem inventar números.
 */
export function ConcludeDialog({ dispute, balance, onConfirm, onClose }) {
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState(emptyFields);
  const [errors, setErrors] = useState({});
  const lock = useRef(false);
  const set = (patch) => setFields((f) => ({ ...f, ...patch }));
  const stepKey = STEPS[step].key;
  const dismissed = fields.decision === "dismissed";

  // Prévia ao vivo: aceita as confirmações só para calcular os números; a
  // validação real (com as confirmações) roda ao continuar e ao concluir.
  const preview = validateResolution({ ...fields, remainderConfirmed: true, retainedConfirmed: true, justification: "preview-ok-text" }, balance, "all").resolution;

  function chooseDecision(decision) {
    setFields({ ...emptyFields(), decision, justification: fields.justification });
    setErrors({});
  }

  function next() {
    const check = validateResolution(fields, balance, stepKey);
    setErrors(check.errors);
    if (Object.keys(check.errors).length === 0) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function submit(event) {
    event.preventDefault();
    // Enter dentro de um campo não pode pular a revisão: fora da etapa 4 só avança.
    if (stepKey !== "review") return next();
    if (lock.current) return; // evita envio duplicado (duplo clique/Enter repetido)
    const check = validateResolution(fields, balance, "all");
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    lock.current = true;
    const result = onConfirm(fields);
    if (!result.ok) {
      lock.current = false;
      setErrors(result.errors);
    }
  }

  const refundLeft = (() => {
    const parsed = parseMoneyToCents(fields.refundText);
    return parsed.ok && parsed.cents < balance.cents ? balance.cents - parsed.cents : null;
  })();

  return (
    <AdminDialog title="Concluir contestação" icon="gavel" wide="lg" description={`Registre a decisão e a destinação dos valores da contestação #${dispute.id}.`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <ol className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Etapas">
          {STEPS.map((s, i) => (
            <li key={s.key} aria-current={i === step ? "step" : undefined} className={`adm-small flex items-center gap-1.5 ${i === step ? "font-medium text-orange" : i < step ? "text-cream/80" : "text-cream/70"}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${i === step ? "border-orange" : "border-hairline"}`}>{i + 1}</span>
              {s.label}
            </li>
          ))}
        </ol>

        {errors.form && <p role="alert" className="adm-text rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">{errors.form}</p>}

        {stepKey === "decision" && (
          <fieldset>
            <legend className="adm-text font-medium text-cream">Etapa 1 · Decisão administrativa <span className="text-orange">*</span></legend>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
              {Object.entries(DISPUTE_DECISIONS).map(([key, label]) => (
                <Choice key={key} name="decision" value={key} current={fields.decision} onChange={chooseDecision}>{label}</Choice>
              ))}
            </div>
            {errors.decision && <p role="alert" className="adm-small mt-1 text-red-400">{errors.decision}</p>}
            {errors.balance && <p role="alert" className="adm-text mt-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">{errors.balance}</p>}
            {!balance.available && <p className="adm-small mt-2 text-amber-300">Sem saldo retido elegível nos dados: apenas "Improcedente (sem ação)" pode ser registrada. {balance.reason}</p>}
          </fieldset>
        )}

        {stepKey === "financial" && (
          <div className="flex flex-col gap-3">
            <p className="adm-text font-medium text-cream">Etapa 2 · Resolução financeira</p>
            {!dismissed && (
              <p className="adm-text rounded-xl border border-hairline bg-surface-2/60 px-3 py-2 text-cream/90">
                Saldo disponível para resolução: <span className="font-medium text-cream">{formatBRL(balance.cents)}</span>
                <span className="adm-small block text-cream/70">Valor pago que segue retido pela plataforma neste pagamento (#PG{dispute.requestId}).</span>
              </p>
            )}

            {fields.decision === "favor_client" && (
              <>
                <fieldset>
                  <legend className="adm-text text-cream/80">Tipo de reembolso <span className="text-orange">*</span></legend>
                  <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                    {Object.entries(REFUND_TYPES).map(([key, label]) => (
                      <Choice key={key} name="refundType" value={key} current={fields.refundType} onChange={(v) => set({ refundType: v, refundText: "", remainderDestination: "", remainderConfirmed: false })}>{label}</Choice>
                    ))}
                  </div>
                  {errors.refundType && <p role="alert" className="adm-small mt-1 text-red-400">{errors.refundType}</p>}
                </fieldset>
                {fields.refundType === "full" && (
                  <p className="adm-small text-cream/70">100% do saldo elegível ({formatBRL(balance.cents)}) é destinado ao cliente. Nada é destinado ao fornecedor e não há comissão sobre a parcela reembolsada.</p>
                )}
                {fields.refundType === "partial" && (
                  <>
                    <MoneyField id="refund-amount" label="Valor a devolver ao cliente (R$)" value={fields.refundText} onChange={(v) => set({ refundText: v, remainderConfirmed: false })} error={errors.refund}
                      hint={refundLeft != null ? `Saldo restante: ${formatBRL(refundLeft)}` : "Informe um valor maior que zero e menor que o saldo."} />
                    <fieldset>
                      <legend className="adm-text text-cream/80">Destino do saldo restante <span className="text-orange">*</span></legend>
                      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                        <Choice name="remainder" value="supplier" current={fields.remainderDestination} onChange={(v) => set({ remainderDestination: v, remainderConfirmed: false })}>Destinar ao fornecedor</Choice>
                        <Choice name="remainder" value="retained" current={fields.remainderDestination} onChange={(v) => set({ remainderDestination: v, remainderConfirmed: false })}>Manter retido</Choice>
                      </div>
                      {errors.remainderDestination && <p role="alert" className="adm-small mt-1 text-red-400">{errors.remainderDestination}</p>}
                      <p className="adm-small mt-1 text-cream/70">O saldo restante não é liberado automaticamente: a destinação precisa ser escolhida e confirmada.</p>
                    </fieldset>
                    {fields.remainderDestination && (
                      <Confirm id="confirm-remainder" checked={fields.remainderConfirmed} onChange={(v) => set({ remainderConfirmed: v })} error={errors.remainderConfirmed}>
                        Confirmo que o saldo restante {refundLeft != null ? `(${formatBRL(refundLeft)}) ` : ""}será {fields.remainderDestination === "supplier" ? "destinado ao fornecedor (com comissão sobre esse valor bruto)" : "mantido retido pela plataforma"}.
                      </Confirm>
                    )}
                  </>
                )}
              </>
            )}

            {fields.decision === "favor_supplier" && (
              <p className="adm-small text-cream/70">O saldo elegível ({formatBRL(balance.cents)}) é destinado ao fornecedor. A comissão incide somente sobre esse valor bruto.</p>
            )}

            {fields.decision === "agreement" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MoneyField id="agreement-client" label="Valor destinado ao cliente (R$)" value={fields.clientText} onChange={(v) => set({ clientText: v, retainedConfirmed: false })} error={errors.clientAmount} />
                  <MoneyField id="agreement-supplier" label="Valor bruto ao fornecedor (R$)" value={fields.supplierText} onChange={(v) => set({ supplierText: v, retainedConfirmed: false })} error={errors.supplierAmount} />
                </div>
                {errors.sum && <p role="alert" className="adm-small text-red-400">{errors.sum}</p>}
                {preview && <p className="adm-small text-cream/70">Saldo que continuará retido: <span className="font-medium text-cream">{formatBRL(preview.retainedCents)}</span></p>}
                {preview && preview.retainedCents > 0 && (
                  <Confirm id="confirm-retained" checked={fields.retainedConfirmed} onChange={(v) => set({ retainedConfirmed: v })} error={errors.retainedConfirmed}>
                    Confirmo que {formatBRL(preview.retainedCents)} não serão destinados a ninguém agora e permanecerão retidos, conforme a justificativa.
                  </Confirm>
                )}
              </>
            )}

            {dismissed && (
              <p className="adm-text text-cream/80">A decisão será registrada sem reembolso nem repasse. O estado financeiro atual é preservado e qualquer liberação posterior dependerá do fluxo financeiro apropriado.</p>
            )}

            {preview && !dismissed && fields.decision !== "agreement" && <DisputeResolutionSummary resolution={preview} />}
            {preview && fields.decision === "agreement" && <DisputeResolutionSummary resolution={preview} />}
          </div>
        )}

        {stepKey === "justification" && (
          <DialogTextarea id="conclude-justification" label="Etapa 3 · Justificativa" required value={fields.justification} onChange={(v) => set({ justification: v })} error={errors.justification} rows={4} placeholder="Explique o motivo da decisão e da destinação dos valores." />
        )}

        {stepKey === "review" && (
          <div className="flex flex-col gap-3">
            <p className="adm-text font-medium text-cream">Etapa 4 · Revisão e confirmação</p>
            {preview && <DisputeResolutionSummary resolution={preview} disputeId={dispute.id} />}
            <div className="rounded-xl border border-hairline bg-surface-2/60 px-3 py-2">
              <p className="adm-small text-cream/70">Justificativa</p>
              <p className="adm-text mt-0.5 text-cream/90">{fields.justification.trim()}</p>
            </div>
            {errors.justification && <p role="alert" className="adm-small text-red-400">{errors.justification}</p>}
          </div>
        )}

        <p className="adm-small rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-300">
          Nenhuma movimentação financeira real será realizada. Registrar a decisão e a destinação é uma autorização demonstrativa: não reembolsa, estorna nem repassa valores e não altera o pagamento. A execução dependerá do backend e do provedor financeiro. {DEMO_NOTE}
        </p>

        <div className="flex flex-wrap justify-between gap-2">
          <div>{step > 0 && <AdminButton variant="secondary" type="button" onClick={() => { setErrors({}); setStep((s) => s - 1); }}>Voltar</AdminButton>}</div>
          <div className="flex flex-wrap justify-end gap-2">
            <AdminButton variant="secondary" type="button" onClick={onClose}>Cancelar</AdminButton>
            {/* key distinto: o mesmo <button> não pode virar "submit" durante o clique em "Continuar" (isso concluiria sem revisão). */}
            {stepKey === "review" ? (
              <AdminButton key="confirm" type="submit">{dismissed ? "Confirmar decisão" : "Confirmar decisão e destinação"}</AdminButton>
            ) : (
              <AdminButton key="next" type="button" onClick={next}>Continuar</AdminButton>
            )}
          </div>
        </div>
      </form>
    </AdminDialog>
  );
}
