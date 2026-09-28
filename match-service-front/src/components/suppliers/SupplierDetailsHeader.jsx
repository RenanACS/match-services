import { Link } from "react-router-dom";
import { StarIcon } from "./icons";

/**
 * Cabeçalho da página de detalhes: volta para o catálogo, identificação
 * da empresa (nome, nota, categoria, localização) e informações
 * institucionais básicas (CNPJ, telefone, tempo na plataforma).
 * Nenhum selo de verificação é exibido — a triagem é da plataforma como
 * um todo, não algo a destacar por fornecedor.
 */
export default function SupplierDetailsHeader({ supplier }) {
  return (
    <div className="flex flex-col gap-4 xl:gap-1.5">
      <Link
        to="/app/fornecedores"
        className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
      >
        ← Voltar para fornecedores
      </Link>

      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
            {supplier.name}
          </h1>
          <span className="flex shrink-0 items-center gap-1 text-base font-medium text-cream/80">
            <StarIcon className="text-orange-light" />
            {supplier.rating.toFixed(1).replace(".", ",")}
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-cream/50 xl:mt-0.5">
          {supplier.category}
          <span className="hidden xl:inline"> · {supplier.location}</span>
        </p>
        <p className="mt-1 text-sm text-cream/60 xl:hidden">{supplier.location}</p>
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-[20px] border border-hairline bg-surface-1 p-5 sm:grid-cols-3 xl:gap-1 xl:p-1.5">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
            CNPJ
          </dt>
          <dd className="mt-1 text-sm text-cream/80 xl:mt-0.5">{supplier.cnpj}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
            Telefone
          </dt>
          <dd className="mt-1 text-sm text-cream/80 xl:mt-0.5">{supplier.phone}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
            No Match Services desde
          </dt>
          <dd className="mt-1 text-sm text-cream/80 xl:mt-0.5">{supplier.memberSince}</dd>
        </div>
      </dl>
    </div>
  );
}
