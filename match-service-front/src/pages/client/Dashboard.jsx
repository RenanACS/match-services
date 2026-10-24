import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSearch from "../../components/dashboard/DashboardSearch";
import PrimaryActions from "../../components/dashboard/PrimaryActions";
import AssistantPromo from "../../components/dashboard/AssistantPromo";
import SummaryStrip from "../../components/dashboard/SummaryStrip";
import RecentRequests from "../../components/dashboard/RecentRequests";
import { mockUser } from "../../data/dashboard";
import useClientProfile from "../../context/useClientProfile";
import { getShortName } from "../../utils/displayName";

/**
 * Dashboard do Cliente (/app).
 * Dados 100% mockados em src/data/dashboard.js — nenhuma chamada de rede.
 * Hierarquia: saudação > busca > ações > indicadores > solicitações > Mia.
 *
 * Visual no padrão do painel administrativo: título de 22px sem descrição,
 * indicadores compactos (rótulo acima do número) e espaçamentos reduzidos.
 * Em telas pequenas o empilhamento é mantido e a página rola naturalmente.
 */
export default function Dashboard() {
  // Mesma fonte de dados do Perfil; sem cliente na sessão mantém "Cliente".
  const { profile } = useClientProfile();
  const greetingName = (profile && getShortName(profile.name, profile.personType)) || mockUser.name;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 xl:gap-3.5">
      <div className="flex flex-col gap-3">
        <DashboardHeader name={greetingName} />
        {/* Busca e ações principais: empilhadas no mobile, lado a lado a
            partir de xl para aproveitar a largura e reduzir a altura. */}
        <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:gap-3">
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
