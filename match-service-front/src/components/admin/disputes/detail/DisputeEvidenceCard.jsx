import Icon from "../../AdminIcons";
import AdminSectionTitle from "../../AdminSectionTitle";

/**
 * Relato do reclamante, resposta da outra parte e anexos DEMONSTRATIVOS. Os
 * anexos são só nomes: não há arquivo real, pré-visualização nem download.
 */
export default function DisputeEvidenceCard({ dispute }) {
  const claimantIsClient = dispute.claimant === "client";
  const claimantLabel = claimantIsClient ? "Cliente" : "Fornecedor";
  const otherLabel = claimantIsClient ? "Fornecedor" : "Cliente";
  return (
    <section aria-labelledby="dispute-evidence" className="flex flex-col gap-4 rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id="dispute-evidence" icon="messageSquare">Relato e evidências</AdminSectionTitle>

      <div>
        <p className="adm-small text-cream/60">Relato do reclamante ({claimantLabel})</p>
        <p className="adm-text mt-1 rounded-xl border border-hairline bg-surface-2/60 px-3 py-2.5 text-cream/90">{dispute.claim}</p>
      </div>

      <div>
        <p className="adm-small text-cream/60">Resposta da outra parte ({otherLabel})</p>
        {dispute.response ? (
          <p className="adm-text mt-1 rounded-xl border border-hairline bg-surface-2/60 px-3 py-2.5 text-cream/90">{dispute.response}</p>
        ) : (
          <p className="adm-text mt-1 text-cream/60">A outra parte ainda não respondeu.</p>
        )}
      </div>

      <div>
        <p className="adm-small text-cream/60">Anexos</p>
        {dispute.attachments.length === 0 ? (
          <p className="adm-text mt-1 text-cream/60">Nenhum anexo enviado.</p>
        ) : (
          <>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {dispute.attachments.map((file) => (
                <li key={file.name} className="adm-text flex items-center gap-2.5 rounded-lg border border-hairline px-3 py-2 text-cream/80">
                  <Icon name="paperclip" size={16} className="text-cream/60" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <span className="adm-small text-cream/50">{file.kind}</span>
                </li>
              ))}
            </ul>
            <p className="adm-small mt-2 text-cream/50">Anexos demonstrativos: nesta versão não há arquivo para abrir ou baixar.</p>
          </>
        )}
      </div>
    </section>
  );
}
