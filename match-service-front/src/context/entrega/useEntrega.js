import { useSyncExternalStore } from "react";
import {
  confirmByClient,
  getEmptyEntrega,
  markAllNotificationsRead,
  markNotificationRead,
  markProviderDone,
  readEntrega,
  resetEntrega,
  subscribeEntrega,
} from "./entregaStore";

const actions = {
  markProviderDone,
  confirmByClient,
  markNotificationRead,
  markAllNotificationsRead,
  resetEntrega,
};

/**
 * Estado compartilhado do fluxo de entrega (fornecedor <-> cliente). Atualiza
 * sozinho quando outra aba grava (evento "storage").
 */
export default function useEntrega() {
  const state = useSyncExternalStore(subscribeEntrega, readEntrega, getEmptyEntrega);
  return { ...state, ...actions };
}
