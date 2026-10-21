import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { ClientStatusBadge, ClientTypeBadge } from "../../components/admin/clients/ClientBadges";
import BlockClientDialog from "../../components/admin/clients/BlockClientDialog";
import ClientRequestsHistory from "../../components/admin/clients/ClientRequestsHistory";
import ClientBlockHistory from "../../components/admin/clients/ClientBlockHistory";
import useAdminClients from "../../context/useAdminClients";
import { CLIENT_TYPE_LABELS } from "../../data/adminClients";
import { formatDate, formatDateTime } from "../../utils/dates";

function Field({ label, children }) {
  return (
    <div>
      <dt className="adm-small text-cream/50">{label}</dt>
      <dd className="mt-0.5 adm-text text-cream">{children}</dd>
    </div>
  );
}

/**
 * Detalhes do cliente (/admin/clientes/:id) — SOMENTE CONSULTA: o admin não
 * edita dados pessoais. Bloqueio/desbloqueio é demonstrativo.
 */
export default function ClienteDetalhe() {
  const { id } = useParams();
  const { state } = useLocation();
  const backTo = `/admin/clientes${state?.fromSearch ?? ""}`;
  const { getClient, blockClient, unblockClient } = useAdminClients();
  const [dialog, setDialog] = useState(null); // "block" | "unblock" | null
  const [notice, setNotice] = useState("");
  const client = getClient(id);

  if (!client) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <h1 className="adm-page-title">Cliente não encontrado</h1>
        <Card>
          <p className="adm-text text-cream/70">Não existe cliente com este identificador.</p>
          <Link to="/admin/clientes" className="mt-3 inline-block adm-text text-orange hover:underline">
            Voltar para Clientes
          </Link>
        </Card>
      </div>
    );
  }

  const blocked = client.status === "blocked";
  const lastBlock = [...client.history].reverse().find((entry) => entry.action === "blocked");
  const { address } = client;

  function handleConfirm(reason) {
    if (dialog === "block") blockClient(client.id, reason);
    else unblockClient(client.id);
    setNotice(
      dialog === "block"
        ? "Conta bloqueada (ação demonstrativa)."
        : "Conta desbloqueada (ação demonstrativa).",
    );
    setDialog(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <Link to={backTo} className="adm-text text-cream/60 transition hover:text-orange">
        ← Clientes
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="adm-page-title">{client.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ClientTypeBadge type={client.type} />
            <ClientStatusBadge status={client.status} />
            <span className="adm-text text-cream/50">Cadastro em {formatDate(client.registeredAt)}</span>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setNotice("");
            setDialog(blocked ? "unblock" : "block");
          }}
        >
          {blocked ? "Desbloquear conta" : "Bloquear conta"}
        </Button>
      </header>

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 adm-text text-emerald-400">
          {notice}
        </p>
      )}

      {blocked && lastBlock && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 adm-text text-red-300">
          Conta bloqueada em {formatDateTime(lastBlock.date)}. Justificativa: {lastBlock.reason}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[2fr_3fr]">
        <div className="flex flex-col gap-5">
          <section aria-labelledby="data-title" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
            <h2 id="data-title" className="adm-section-title">Dados cadastrais</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Field label="Nome completo ou razão social">{client.name}</Field>
              <Field label="Tipo">{CLIENT_TYPE_LABELS[client.type]}</Field>
              <Field label={client.type === "PF" ? "CPF" : "CNPJ"}>
                <span className="font-mono text-[12px]">{client.document}</span>
              </Field>
              <Field label="E-mail">{client.email}</Field>
              <Field label="Telefone">{client.phone}</Field>
              <Field label="Endereço">
                {address.street}, {address.number} — {address.district}
                <br />
                {address.city}/{address.state} · CEP {address.cep}
              </Field>
            </dl>
            <p className="mt-4 adm-small text-cream/40">
              Somente consulta: o administrador não edita os dados pessoais do cliente.
            </p>
          </section>
          <ClientBlockHistory history={client.history} />
        </div>
        <ClientRequestsHistory requests={client.requests} />
      </div>

      {dialog && (
        <BlockClientDialog
          client={client}
          mode={dialog}
          onConfirm={handleConfirm}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
