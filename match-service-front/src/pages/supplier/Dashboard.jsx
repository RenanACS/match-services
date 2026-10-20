import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/supplier/StatusBadge";
import SummaryCard from "../../components/supplier/SummaryCard";
import Avatar from "../../components/supplier/Avatar";
import { IconLink } from "../../components/supplier/IconLink";
import { CheckIcon, ClockIcon, EyeIcon, GearIcon, StarIcon, WalletIcon, XIcon } from "../../components/supplier/icons";
import useAuth from "../../context/auth/useAuth";
import useSupplierData from "../../context/supplier/useSupplierData";
import { matchesRequestStatus } from "../../utils/entregaOverlay";
import { formatCurrency, formatDate, formatTime } from "../../utils/supplierFormat";

// Quantas solicitações aparecem no resumo (o resto fica em "Ver todas").
const LATEST_COUNT = 4;

/**
 * Dashboard do fornecedor (/fornecedor). Os números são calculados a partir
 * do estado da sessão (useSupplierData) e do fluxo de entrega, então refletem
 * mudanças feitas nas outras telas. Os cards levam à tela correspondente; os
 * de solicitação abrem a lista já filtrada pelo status.
 *
 * A partir de lg os espaçamentos são compactos e o painel mostra 3 linhas
 * (4 em telas com 820px+ de altura) para caber numa única tela, sem rolagem,
 * em 1366x768 e 1920x1080. Em telas menores o conteúdo empilha e rola.
 */
export default function SupplierDashboard() {
  const { session } = useAuth();
  const { requests, payments, reviews, profile } = useSupplierData();
  // Mesmo nome do menu do usuário (SupplierLayout).
  const name = profile.name || session?.email?.split("@")[0] || "Fornecedor";

  const count = (status) => requests.filter((request) => matchesRequestStatus(request, status)).length;
  const latest = [...requests].sort((a, b) => b.date.localeCompare(a.date)).slice(0, LATEST_COUNT);
  const released = payments
    .filter((payment) => payment.status === "released")
    .reduce((sum, payment) => sum + payment.value, 0);
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const cards = [
    { to: "/fornecedor/solicitacoes?status=pending", icon: ClockIcon, tone: "warning", label: "Aguardando confirmação", value: count("pending") },
    { to: "/fornecedor/solicitacoes?status=progress", icon: GearIcon, tone: "info", label: "Em andamento", value: count("progress") },
    { to: "/fornecedor/solicitacoes?status=done", icon: CheckIcon, tone: "success", label: "Concluídas", value: count("done") },
    { to: "/fornecedor/solicitacoes?status=canceled", icon: XIcon, tone: "danger", label: "Canceladas", value: count("canceled") },
    { to: "/fornecedor/pagamentos", icon: WalletIcon, tone: "orange", label: "Faturamento do mês", value: formatCurrency(released) },
    {
      to: "/fornecedor/avaliacoes",
      icon: StarIcon,
      tone: "orange",
      label: `Avaliações (${reviews.length})`,
      value: average.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:gap-4">
      <header className="min-w-0">
        <h1 className="truncate font-display text-3xl font-semibold tracking-tight text-cream lg:text-2xl">
          Olá, {name}
        </h1>
        <p className="mt-1 text-sm text-cream/60">Resumo da sua operação</p>
      </header>

      <section aria-label="Resumo" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-2.5 xl:grid-cols-3">
        {cards.map((card) => (
          <SummaryCard key={card.label} compact {...card} />
        ))}
      </section>

      <Card className="p-0">
        <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6 lg:py-2.5">
          <h2 className="font-display text-lg font-semibold">Últimas solicitações</h2>
          <Link
            to="/fornecedor/solicitacoes"
            className="font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
          >
            Ver todas →
          </Link>
        </div>

        {/* Tabela a partir de md; em telas menores, lista empilhada. */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-y border-hairline font-mono text-[11px] uppercase tracking-widest text-cream/50">
                <th className="px-6 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Cliente</th>
                <th className="px-3 py-2 font-medium">Serviço</th>
                <th className="px-3 py-2 font-medium">Data</th>
                <th className="px-3 py-2 font-medium">Valor</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-6 py-2 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {latest.map((request, index) => (
                // A 4ª linha só aparece em telas altas, para não gerar rolagem em 768px.
                <tr key={request.id} className={index === 3 ? "hidden [@media(min-height:820px)]:table-row" : ""}>
                  <td className="px-6 py-2 font-mono text-cream/80">#{request.id}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar name={request.client.name} />
                      <div>
                        <p className="text-cream">{request.client.name}</p>
                        <p className="text-xs text-cream/50">{request.client.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-cream">{request.service}</p>
                    <p className="text-xs text-cream/50">{request.category}</p>
                  </td>
                  <td className="px-3 py-2 text-cream/80">
                    <p>{formatDate(request.date)}</p>
                    <p className="text-xs text-cream/50">{formatTime(request.date)}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-cream">{formatCurrency(request.value)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-2 text-right">
                    <IconLink to={`/fornecedor/solicitacoes/${request.id}`} label={`Ver detalhes da solicitação #${request.id}`}>
                      <EyeIcon width={18} height={18} />
                    </IconLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-hairline border-t border-hairline md:hidden">
          {latest.map((request) => (
            <li key={request.id} className="flex flex-col gap-2 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-cream/80">#{request.id}</span>
                <StatusBadge status={request.status} />
              </div>
              <div className="flex items-center gap-3">
                <Avatar name={request.client.name} />
                <div className="min-w-0">
                  <p className="truncate text-cream">{request.service}</p>
                  <p className="truncate text-xs text-cream/50">
                    {request.client.name} · {formatDate(request.date)} · {formatCurrency(request.value)}
                  </p>
                </div>
              </div>
              <Link
                to={`/fornecedor/solicitacoes/${request.id}`}
                className="self-start font-mono text-[11px] uppercase tracking-widest text-cream/60 transition hover:text-orange"
              >
                Ver detalhes →
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
