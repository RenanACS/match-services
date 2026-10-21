import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import { DemoNote } from "./RequestParts";

/** Confirmação de conclusão: informa à plataforma e inicia o processo de liberação. */
export default function ConfirmCompletionDialog({ title, busy, onConfirm, onClose }) {
  return (
    <Dialog title="Confirmar conclusão do serviço?" titleId="confirm-completion-title" onClose={busy ? () => {} : onClose}>
      <p className="app-text text-cream/70">
        Você está informando à plataforma que o serviço <strong className="font-medium text-cream">{title}</strong> foi realizado.
      </p>
      <p className="app-text mt-2 text-cream/70">
        Ao confirmar, o processo de liberação do pagamento ao fornecedor é iniciado: o backend valida a operação e solicita a
        liberação ao provedor financeiro. O pagamento só aparece como liberado depois da confirmação do provedor.
      </p>
      <div className="mt-3">
        <DemoNote>Operação simulada: nenhuma liberação real é feita e nada é enviado a um servidor nesta etapa.</DemoNote>
      </div>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" appearance="app" disabled={busy} onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" variant="primary" appearance="app" disabled={busy} onClick={onConfirm}>
          {busy ? "Registrando..." : "Confirmar conclusão"}
        </Button>
      </div>
    </Dialog>
  );
}
