import { useRef } from "react";

/**
 * Campo de anexo opcional. Só guarda o `File` selecionado em memória e
 * mostra o nome do arquivo — nenhum upload real acontece nesta etapa.
 */
export default function FileUpload({ file, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-cream/60">
        Anexo (opcional)
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-hairline px-5 font-mono text-xs font-medium uppercase tracking-widest text-cream transition hover:border-orange/60"
        >
          Adicionar arquivo
        </button>
        {file && (
          <span className="truncate text-sm text-cream/60">{file.name}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
    </div>
  );
}
