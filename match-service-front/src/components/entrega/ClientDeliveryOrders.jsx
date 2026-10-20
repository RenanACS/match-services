import Card from "../ui/Card";
import Button from "../ui/Button";
import useEntrega from "../../context/entrega/useEntrega";
import { DEMO_ORDER_IDS } from "../../context/entrega/entregaStore";
import { supplierRequests } from "../../data/fornecedor";
import { formatCurrency, formatDate, formatTime } from "../../utils/supplierFormat";

// Mesmos IDs e dados da solicitação do fornecedor (data/fornecedor.js), para
// os dois lados se enxergarem na demonstração.
const ORDERS = supplierRequests.filter((request) => DEMO_ORDER_IDS.includes(request.id));

function OrderCard({ order, state, onConfirm }) {
  const confirmed = Boolean(state?.clientConfirmedAt);
  const providerDone = Boolean(state?.providerDoneAt);

  return (
    <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cream/45">
          Pedido #{order.id} · {order.category}
        </p>
        <h3 className="mt-0.5 font-display text-base font-medium text-cream">{order.service}</h3>
        <p className="text-xs text-cream/50">
          {formatCurrency(order.value)} · solicitado em {formatDate(order.date)} às {formatTime(order.date)}
        </p>

        {confirmed ? (
          <p role="status" className="mt-2 text-sm text-emerald-400">
            Serviço confirmado. O pagamento foi liberado ao fornecedor.
          </p>
        ) : providerDone ? (
          <p role="status" className="mt-2 text-sm text-orange">
            O fornecedor informou que o serviço foi concluído.
          </p>
        ) : (
          <p className="mt-2 text-sm text-cream/60">
            Em andamento. Se o serviço já estiver pronto, você pode confirmar agora.
          </p>
        )}
      </div>

      {!confirmed && (
        <Button type="button" className="shrink-0" onClick={() => onConfirm(order.id)}>
          Confirmar serviço prestado
        </Button>
      )}
    </Card>
  );
}

/**
 * Pedidos em andamento com confirmação de entrega (demonstração). O cliente
 * vê o aviso quando o fornecedor marca o serviço como concluído e confirma
 * para liberar o pagamento — ou confirma antes, se o serviço já estiver pronto.
 */
export default function ClientDeliveryOrders() {
  const { orders, confirmByClient } = useEntrega();

  return (
    <section aria-label="Serviços em andamento" className="flex flex-col gap-3">
      <h2 className="font-mono text-[11px] uppercase tracking-widest text-cream/50">Serviços em andamento</h2>
      {ORDERS.map((order) => (
        <OrderCard key={order.id} order={order} state={orders[order.id]} onConfirm={confirmByClient} />
      ))}
    </section>
  );
}
