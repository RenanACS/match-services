import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ClientFilters from "../../components/admin/clients/ClientFilters";
import ClientsTable from "../../components/admin/clients/ClientsTable";
import ClientCardList from "../../components/admin/clients/ClientCardList";
import ClientStatCard from "../../components/admin/clients/ClientStatCard";
import BlockClientDialog from "../../components/admin/clients/BlockClientDialog";
import Pagination from "../../components/admin/Pagination";
import useAdminClients from "../../context/useAdminClients";
import { filterClients, paginate, PAGE_SIZE } from "../../services/adminClients";

const VALID_TYPES = ["all", "PF", "PJ"];
const VALID_STATUS = ["all", "active", "blocked"];

/**
 * Clientes (/admin/clientes): listagem com busca, filtros e paginação.
 * Os filtros e a página ficam na URL (?q=&tipo=&situacao=&pagina=), então
 * voltar dos detalhes preserva a lista. Somente consulta; bloqueio é
 * demonstrativo (ver AdminClientsProvider).
 */
export default function ClientesAdmin() {
  const { clients, blockClient, unblockClient } = useAdminClients();
  const [params, setParams] = useSearchParams();
  const [dialog, setDialog] = useState(null); // { client, mode }
  const [notice, setNotice] = useState("");

  const query = params.get("q") ?? "";
  const type = VALID_TYPES.includes(params.get("tipo")) ? params.get("tipo") : "all";
  const status = VALID_STATUS.includes(params.get("situacao")) ? params.get("situacao") : "all";
  const requestedPage = Number(params.get("pagina")) || 1;

  function update(changes) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === "all" || (key === "pagina" && value === 1)) next.delete(key);
      else next.set(key, String(value));
    }
    setParams(next, { replace: true });
  }
  const updateFilter = (changes) => update({ ...changes, pagina: 1 });

  const counts = useMemo(
    () => ({
      pf: clients.filter((c) => c.type === "PF").length,
      pj: clients.filter((c) => c.type === "PJ").length,
      blocked: clients.filter((c) => c.status === "blocked").length,
    }),
    [clients],
  );

  const filtered = useMemo(
    () => filterClients(clients, { query, type, status }),
    [clients, query, type, status],
  );
  const pageData = paginate(filtered, requestedPage, PAGE_SIZE);

  function handleConfirm(reason) {
    const { client, mode } = dialog;
    if (mode === "block") blockClient(client.id, reason);
    else unblockClient(client.id);
    setNotice(
      mode === "block"
        ? `Conta de ${client.name} bloqueada (ação demonstrativa).`
        : `Conta de ${client.name} desbloqueada (ação demonstrativa).`,
    );
    setDialog(null);
  }

  function clearFilters() {
    setNotice("");
    setParams(new URLSearchParams(), { replace: true });
  }

  function askToggleBlock(client) {
    setNotice("");
    setDialog({ client, mode: client.status === "blocked" ? "unblock" : "block" });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:gap-3.5">
      <header>
        <h1 className="adm-page-title">Clientes</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-3 xl:gap-4">
        <ClientStatCard
          icon="user"
          value={counts.pf}
          label="Clientes PF"
          onClick={() => updateFilter({ tipo: "PF", situacao: "all" })}
        />
        <ClientStatCard
          icon="building"
          value={counts.pj}
          label="Clientes PJ"
          onClick={() => updateFilter({ tipo: "PJ", situacao: "all" })}
        />
        <ClientStatCard
          icon="lock"
          tone="red"
          value={counts.blocked}
          label="Contas bloqueadas"
          onClick={() => updateFilter({ tipo: "all", situacao: "blocked" })}
        />
      </div>

      <ClientFilters
        query={query}
        type={type}
        status={status}
        onQueryChange={(value) => updateFilter({ q: value })}
        onTypeChange={(value) => updateFilter({ tipo: value })}
        onStatusChange={(value) => updateFilter({ situacao: value })}
        onClear={clearFilters}
      />

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 adm-text text-emerald-400">
          {notice}
        </p>
      )}

      <section aria-label="Lista de clientes" className="rounded-[20px] border border-hairline bg-surface-1">
        {pageData.total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-medium text-cream">Nenhum cliente encontrado</p>
            <p className="mt-1 adm-text text-cream/70">Ajuste a busca ou os filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <ClientsTable clients={pageData.items} onToggleBlock={askToggleBlock} />
            </div>
            <div className="xl:hidden">
              <ClientCardList clients={pageData.items} onToggleBlock={askToggleBlock} />
            </div>
            <div className="border-t border-hairline">
              <Pagination
                page={pageData.page}
                totalPages={pageData.totalPages}
                total={pageData.total}
                start={pageData.start}
                pageSize={PAGE_SIZE}
                itemLabel="clientes"
                onPageChange={(page) => update({ pagina: page })}
              />
            </div>
          </>
        )}
      </section>

      {dialog && (
        <BlockClientDialog
          client={dialog.client}
          mode={dialog.mode}
          onConfirm={handleConfirm}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
