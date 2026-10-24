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
 * "Solicitar serviço" navega para /app/solicitacao, passando o id do
 * fornecedor por querystring (pré-seleciona o fornecedor no formulário).
 */
export default function FornecedorDetalhes() {
  const { id } = useParams();
  const supplier = suppliers.find((item) => item.id === id);

  if (!supplier) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3">
        <h1 className="app-page-title text-cream">Fornecedor não encontrado</h1>
        <Link
          to="/app/fornecedores"
          className="app-text inline-flex items-center gap-1.5 text-cream/70 transition hover:text-orange"
        >
          Voltar para fornecedores
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
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
          size="md"
          appearance="app"
          className="w-full sm:w-auto"
        >
          Solicitar serviço
        </Button>
      </div>
    </div>
  );
}
