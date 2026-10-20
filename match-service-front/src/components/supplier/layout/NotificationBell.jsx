import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useEntrega from "../../../context/entrega/useEntrega";
import useDismiss from "./useDismiss";
import { formatDate, formatTime } from "../../../utils/supplierFormat";
import { BellIcon } from "../icons";

/**
 * Sininho do topo da área do fornecedor: avisos do fluxo de entrega (ex.:
 * "Cliente confirmou. Pagamento liberado"). Avisos não lidos têm marcador;
 * clicar num aviso o marca como lido e abre a solicitação.
 */
export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useEntrega();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useDismiss(rootRef, open, () => setOpen(false));

  const mine = notifications.filter((item) => item.to === "fornecedor");
  const unread = mine.filter((item) => !item.read).length;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unread ? `Notificações (${unread} não lidas)` : "Notificações"}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-surface-1 text-cream/70 transition hover:border-orange/60 hover:text-orange"
      >
        <BellIcon width={20} height={20} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 font-mono text-[10px] font-semibold text-ink">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-hairline bg-surface-2 shadow-lg">
          <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
            <h2 className="font-display text-sm font-semibold">Notificações</h2>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead("fornecedor")}
                className="font-mono text-[10px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {mine.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-cream/55">Nenhuma notificação por enquanto.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-hairline overflow-y-auto">
              {mine.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/fornecedor/solicitacoes/${item.requestId}`}
                    onClick={() => {
                      markNotificationRead(item.id);
                      setOpen(false);
                    }}
                    className={`flex gap-3 px-4 py-3 transition hover:bg-surface-3 ${item.read ? "" : "bg-orange-soft/40"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-transparent" : "bg-orange"}`}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-cream">{item.text}</span>
                      <span className="block text-xs text-cream/50">
                        {formatDate(item.at)} às {formatTime(item.at)}
                        {item.read ? "" : " · não lida"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
