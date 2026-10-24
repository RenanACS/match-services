import Icon from "../../AdminIcons";
import TonePill from "./TonePill";
import { formatDate } from "../../../../utils/dates";

/**
 * Documentos enviados para a análise cadastral — FICTÍCIOS. Não há arquivo
 * real, nem verificação automática ou externa. Com o Django, o acesso a estes
 * arquivos deve ser restrito a administradores autenticados.
 */
export default function DocumentsTab({ supplier }) {
  return (
    <section aria-labelledby="documents-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <h2 id="documents-title" className="adm-section-title">Documentos para análise cadastral</h2>
      <ul className="mt-4 divide-y divide-hairline">
        {supplier.documents.map((doc) => (
          <li key={doc.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-cream/70">
              <Icon name="file" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="adm-text font-medium text-cream">{doc.name}</p>
              <p className="truncate adm-small text-cream/70">
                {doc.file} · {doc.size} · enviado em {formatDate(doc.sentAt)}
              </p>
            </div>
            <TonePill tone="zinc">Recebido</TonePill>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-small leading-relaxed text-cream/70">
        Documentos fictícios, apenas para demonstração. Não há pré-visualização, conferência automática nem
        verificação externa. Quando houver autenticação real, somente administradores poderão acessar estes arquivos.
      </p>
    </section>
  );
}
