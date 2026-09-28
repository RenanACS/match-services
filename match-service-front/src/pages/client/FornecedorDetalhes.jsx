import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import SupplierDetailsHeader from "../../components/suppliers/SupplierDetailsHeader";
import SupplierAbout from "../../components/suppliers/SupplierAbout";
import SupplierServices from "../../components/suppliers/SupplierServices";
import SupplierReviews from "../../components/suppliers/SupplierReviews";
import { suppliers } from "../../data/suppliers";

/**
 * Detalhes do fornecedor (/app/fornecedores/:id).
 * Dados 100% mockados em src/data/suppliers.js — o fornecedor é
 * localizado pelo :id da URL via `suppliers.find`, sem chamada de rede.
 * "Solicitar serviço" só prepara a navegação para /app/solicitacao,
 * passando o id do fornecedor por querystring — a tela de solicitação
 * em si continua sendo o PlaceholderPage já existente.
 */
export default function FornecedorDetalhes() {
  const { id } = useParams();
  const supplier = suppliers.find((item) => item.id === id);

  if (!supplier) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4">
        <p className="text-sm text-cream/70">Fornecedor não encontrado.</p>
        <Link
          to="/app/fornecedores"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
        >
          Voltar para fornecedores
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 xl:gap-2">
      <SupplierDetailsHeader supplier={supplier} />
      <SupplierAbout description={supplier.fullDescription} />
      <SupplierServices services={supplier.services} />
      <SupplierReviews
        rating={supplier.rating}
        reviewsCount={supplier.reviewsCount}
        reviews={supplier.reviews}
      />

      <div>
        <Button
          as={Link}
          to={`/app/solicitacao?fornecedor=${supplier.id}`}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto xl:min-h-[44px] xl:py-2.5"
        >
          Solicitar serviço
        </Button>
      </div>
    </div>
  );
}
