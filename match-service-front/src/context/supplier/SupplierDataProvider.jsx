import { useCallback, useMemo, useState } from "react";
import { SupplierDataContext } from "./SupplierDataContext";
import useAuth from "../auth/useAuth";
import { createSeed, readSupplierData, writeSupplierData } from "./supplierDataStore";
import { toLocalIso } from "../../utils/supplierFormat";
import useEntrega from "../entrega/useEntrega";
import { applyDeliveryToPayment, applyDeliveryToRequest } from "../../utils/entregaOverlay";

const STATUS_HISTORY_TEXT = {
  progress: "Solicitação aceita pelo fornecedor",
  done: "Serviço concluído",
  canceled: "Solicitação cancelada",
};

function nextId(items) {
  return String(Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1);
}

/**
 * Estado da área do fornecedor durante a sessão (mocks editáveis).
 *  - updateRequestStatus(id, status): muda o status e registra no histórico.
 *  - saveProposal(values, id?): cria (status "enviada") ou edita; devolve o id.
 *  - saveService(values, id?) / deleteService(id) / toggleService(id)
 *  - replyToReview(id, text)
 *  - updateProfile(values)
 * Tudo vai para o sessionStorage; o logout apaga (clearSupplierData).
 */
export default function SupplierDataProvider({ children }) {
  const { session } = useAuth();
  const [data, setData] = useState(() => readSupplierData() ?? createSeed(session));

  // Estado compartilhado com o cliente (localStorage): aplicado POR CIMA dos
  // dados da sessão, então sobrevive ao logout e atualiza ao vivo entre abas.
  const { orders } = useEntrega();
  const requests = useMemo(
    () => data.requests.map((request) => applyDeliveryToRequest(request, orders[request.id])),
    [data.requests, orders],
  );
  const payments = useMemo(
    () => data.payments.map((payment) => applyDeliveryToPayment(payment, orders)),
    [data.payments, orders],
  );

  const update = useCallback((change) => {
    setData((current) => {
      const next = change(current);
      writeSupplierData(next);
      return next;
    });
  }, []);

  const updateRequestStatus = useCallback(
    (id, status) => {
      update((current) => ({
        ...current,
        requests: current.requests.map((request) =>
          request.id === id
            ? {
                ...request,
                status,
                history: [
                  ...request.history,
                  { at: toLocalIso(new Date()), text: STATUS_HISTORY_TEXT[status] },
                ],
              }
            : request,
        ),
      }));
    },
    [update],
  );

  // Cria/edita proposta. O id novo é calculado aqui (fora do updater) para
  // poder ser devolvido a quem chamou.
  const saveProposal = useCallback(
    (values, id) => {
      const proposalId = id ?? nextId(data.proposals);
      update((current) => ({
        ...current,
        proposals: id
          ? current.proposals.map((item) => (item.id === id ? { ...item, ...values } : item))
          : [
              {
                ...values,
                id: proposalId,
                status: "sent",
                sentAt: toLocalIso(new Date()),
              },
              ...current.proposals,
            ],
      }));
      return proposalId;
    },
    [data.proposals, update],
  );

  const saveService = useCallback(
    (values, id) => {
      const serviceId = id ?? nextId(data.services);
      update((current) => ({
        ...current,
        services: id
          ? current.services.map((item) => (item.id === id ? { ...item, ...values } : item))
          : [{ ...values, id: serviceId }, ...current.services],
      }));
      return serviceId;
    },
    [data.services, update],
  );

  const deleteService = useCallback(
    (id) => {
      update((current) => ({
        ...current,
        services: current.services.filter((item) => item.id !== id),
      }));
    },
    [update],
  );

  const toggleService = useCallback(
    (id) => {
      update((current) => ({
        ...current,
        services: current.services.map((item) =>
          item.id === id ? { ...item, active: !item.active } : item,
        ),
      }));
    },
    [update],
  );

  const replyToReview = useCallback(
    (id, text) => {
      update((current) => ({
        ...current,
        reviews: current.reviews.map((item) =>
          item.id === id ? { ...item, reply: { text, at: toLocalIso(new Date()) } } : item,
        ),
      }));
    },
    [update],
  );

  const updateProfile = useCallback(
    (values) => {
      update((current) => ({ ...current, profile: { ...current.profile, ...values } }));
    },
    [update],
  );

  const value = useMemo(
    () => ({
      ...data,
      requests,
      payments,
      updateRequestStatus,
      saveProposal,
      saveService,
      deleteService,
      toggleService,
      replyToReview,
      updateProfile,
    }),
    [
      data,
      requests,
      payments,
      updateRequestStatus,
      saveProposal,
      saveService,
      deleteService,
      toggleService,
      replyToReview,
      updateProfile,
    ],
  );

  return <SupplierDataContext.Provider value={value}>{children}</SupplierDataContext.Provider>;
}
