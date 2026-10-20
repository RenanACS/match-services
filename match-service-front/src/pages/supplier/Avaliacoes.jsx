import { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Avatar from "../../components/supplier/Avatar";
import Stars from "../../components/supplier/Stars";
import PageHeader from "../../components/supplier/PageHeader";
import Pagination from "../../components/supplier/Pagination";
import FormField from "../../components/supplier/FormField";
import useSupplierData from "../../context/supplier/useSupplierData";
import { formatDate } from "../../utils/supplierFormat";
import { paginate } from "../../utils/supplierFilters";

const PAGE_SIZE = 5;

function ReplyBox({ review, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.reply?.text ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim().length < 5) {
      setError("Escreva uma resposta com pelo menos 5 caracteres.");
      return;
    }
    onSave(review.id, text.trim());
    setError("");
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3">
        <FormField error={error}>
          <Textarea
            id={`reply-${review.id}`}
            label="Sua resposta"
            rows={3}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setError("");
            }}
          />
        </FormField>
        <div className="flex gap-3">
          <Button type="submit">Salvar resposta</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setText(review.reply?.text ?? "");
              setError("");
              setEditing(false);
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    );
  }

  if (review.reply) {
    return (
      <div className="mt-4 rounded-xl border border-hairline bg-surface-2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cream/45">
          Sua resposta · {formatDate(review.reply.at)}
        </p>
        <p className="mt-1 text-sm text-cream/80">{review.reply.text}</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
        >
          Editar resposta
        </button>
      </div>
    );
  }

  return (
    <Button type="button" variant="secondary" className="mt-4" onClick={() => setEditing(true)}>
      Responder
    </Button>
  );
}

/** Avaliações recebidas (/fornecedor/avaliacoes): nota média, distribuição, filtro e resposta. */
export default function SupplierReviews() {
  const { reviews, replyToReview } = useSupplierData();
  const [rating, setRating] = useState("all");
  const [page, setPage] = useState(1);

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const filtered = reviews
    .filter((review) => rating === "all" || review.rating === Number(rating))
    .sort((a, b) => b.date.localeCompare(a.date));
  const { pageItems, pages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);

  function changeRating(next) {
    setRating(next);
    setPage(1);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader title="Avaliações" description="Veja o que os clientes dizem sobre o seu trabalho e responda." />

      <section aria-label="Resumo das avaliações" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-display text-5xl font-semibold text-cream">
            {average.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </p>
          <Stars value={average} size={20} />
          <p className="text-sm text-cream/55">{reviews.length} avaliações</p>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="font-display text-lg font-semibold">Distribuição das notas</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const total = reviews.filter((review) => review.rating === star).length;
              const percent = reviews.length ? Math.round((total / reviews.length) * 100) : 0;
              return (
                <li key={star}>
                  <button
                    type="button"
                    onClick={() => changeRating(rating === String(star) ? "all" : String(star))}
                    aria-pressed={rating === String(star)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 text-sm transition hover:bg-surface-2 ${
                      rating === String(star) ? "bg-orange-soft" : ""
                    }`}
                  >
                    <span className="w-10 shrink-0 text-left font-mono text-cream/70">{star} ★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                      <span className="block h-full rounded-full bg-orange" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="w-8 shrink-0 text-right text-cream/60">{total}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      <div className="max-w-xs">
        <Select id="review-rating" label="Filtrar por nota" value={rating} onChange={(event) => changeRating(event.target.value)}>
          <option value="all">Todas as notas</option>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} {star === 1 ? "estrela" : "estrelas"}
            </option>
          ))}
        </Select>
      </div>

      {pageItems.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-cream/60">Nenhuma avaliação com essa nota.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {pageItems.map((review) => (
            <li key={review.id}>
              <Card>
                <div className="flex items-start gap-3">
                  <Avatar name={review.client} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-cream">{review.client}</p>
                      <span className="text-xs text-cream/50">{formatDate(review.date)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Stars value={review.rating} />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-cream/45">
                        {review.service}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-cream/75">{review.comment}</p>
                    <ReplyBox review={review} onSave={replyToReview} />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Card className="p-0">
        <Pagination
          page={currentPage}
          pages={pages}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          noun="avaliações"
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
