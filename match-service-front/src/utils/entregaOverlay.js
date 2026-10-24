// Aplica o estado compartilhado de entrega (context/entrega) sobre os dados
// do fornecedor, sem alterar o que está guardado na sessão dele:
//   - fornecedor marcou concluído, cliente ainda não -> status "awaiting"
//   - cliente confirmou                              -> status "done" + pagamento "released"

export function applyDeliveryToRequest(request, order) {
  if (!order) return request;

  const history = [...request.history];
  if (order.providerDoneAt) history.push({ at: order.providerDoneAt, text: "Serviço informado como concluído pelo fornecedor" });
  if (order.clientConfirmedAt) {
    history.push({ at: order.clientConfirmedAt, text: "Cliente confirmou o serviço prestado" });
    history.push({ at: order.paymentReleasedAt ?? order.clientConfirmedAt, text: "Pagamento liberado" });
  }

  let status = request.status;
  if (order.clientConfirmedAt && status === "progress") status = "done";
  else if (order.providerDoneAt && status === "progress") status = "awaiting";

  return { ...request, status, history, delivery: order };
}

export function applyDeliveryToPayment(payment, orders) {
  const order = payment.requestId ? orders[payment.requestId] : null;
  if (order?.paymentReleasedAt && payment.status === "escrow") {
    return { ...payment, status: "released", date: order.paymentReleasedAt };
  }
  return payment;
}

// "Em andamento" no Dashboard e nos filtros inclui o estado intermediário.
export function matchesRequestStatus(request, status) {
  if (status === "all") return true;
  if (status === "progress") return request.status === "progress" || request.status === "awaiting";
  return request.status === status;
}
