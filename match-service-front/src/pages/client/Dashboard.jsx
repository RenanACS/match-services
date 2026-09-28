import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSearch from "../../components/dashboard/DashboardSearch";
import PrimaryActions from "../../components/dashboard/PrimaryActions";
import AssistantPromo from "../../components/dashboard/AssistantPromo";
import SummaryStrip from "../../components/dashboard/SummaryStrip";
import RecentRequests from "../../components/dashboard/RecentRequests";
import { mockUser } from "../../data/dashboard";

/**
 * Dashboard do Cliente (/app).
 * Dados 100% mockados em src/data/dashboard.js — nenhuma chamada de rede.
 * Hierarquia: saudação > busca > ações > indicadores > solicitações > Mia.
 *
 * "Ações rápidas" foi removida (redundante com a busca/botões do topo e a
 * sidebar) e o antigo card grande do Assistente IA virou o acesso compacto
 * à Mia (AssistantPromo.jsx), posicionado após "Solicitações recentes" para
 * não competir com o hub de fornecedores, foco principal do produto.
 *
 * A partir de xl (1280px+) os espaçamentos ficam mais compactos para caber
 * em uma única viewport desktop sem rolagem em 1366x768/1440x900/1920x1080.
 * Em mobile/tablet (abaixo de xl) o empilhamento e os espaçamentos originais
 * são mantidos.
 */
export default function Dashboard() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 xl:gap-3">
      <div className="flex flex-col gap-6 xl:gap-2">
        <DashboardHeader name={mockUser.name} />
        {/* Busca e ações principais: empilhadas no mobile, lado a lado a
            partir de xl para aproveitar a largura e reduzir a altura. */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch xl:gap-3">
          <div className="xl:flex-1">
            <DashboardSearch />
          </div>
          <PrimaryActions />
        </div>
      </div>

      <SummaryStrip />
      <RecentRequests />
      <AssistantPromo />
    </div>
  );
}
