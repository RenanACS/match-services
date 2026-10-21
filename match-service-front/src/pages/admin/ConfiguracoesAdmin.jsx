import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSectionTitle from "../../components/admin/AdminSectionTitle";
import AdminSwitch from "../../components/admin/AdminSwitch";
import Icon from "../../components/admin/AdminIcons";
import { COMMISSION_RATE_PERCENT } from "../../data/adminDashboard";
import { loadDemoState, saveDemoState } from "../../utils/demoStorage";

const STORAGE_KEY = "matchservice.admin.settings.v1";
const DEFAULT_PREFS = { disputes: true, requests: true, financial: true };

function loadPrefs() {
  const saved = loadDemoState(STORAGE_KEY, {});
  return Object.fromEntries(Object.keys(DEFAULT_PREFS).map((key) => [key, typeof saved[key] === "boolean" ? saved[key] : DEFAULT_PREFS[key]]));
}

function Section({ id, icon, title, description, badge, children }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 py-5 first:pt-0 last:pb-0 lg:grid-cols-[260px_1fr] lg:gap-8">
      <div>
        <AdminSectionTitle id={id} icon={icon}>{title}</AdminSectionTitle>
        <p className="adm-small mt-1 text-cream/60">{description}</p>
        {badge && <span className="adm-badge mt-2 inline-flex rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-1 text-amber-400">{badge}</span>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="adm-text text-cream/60 sm:w-56 sm:shrink-0">{label}</dt>
      <dd className="adm-text min-w-0 text-cream">{children}</dd>
    </div>
  );
}

/**
 * Configurações do Admin (/admin/configuracoes): informações da plataforma,
 * parâmetros financeiros (SOMENTE exibição), preferências de notificação
 * (funcionam no front e ficam salvas só neste navegador) e segurança/acesso
 * (informativo). Nada aqui altera comissão de contratos ou pagamentos, nem
 * simula senha ou autenticação.
 */
export default function ConfiguracoesAdmin() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    saveDemoState(STORAGE_KEY, prefs);
  }, [prefs]);

  function toggle(key, label) {
    return (value) => {
      setPrefs((current) => ({ ...current, [key]: value }));
      setFeedback(`${label}: ${value ? "ativado" : "desativado"} (preferência demonstrativa, guardada só neste navegador).`);
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header>
        <h1 className="adm-page-title">Configurações</h1>
      </header>

      <div className="divide-y divide-hairline rounded-[20px] border border-hairline bg-surface-1 p-5 sm:p-6">
        <Section id="cfg-platform" icon="building" title="Dados da plataforma" description="Informações institucionais básicas (demonstrativas).">
          <dl className="divide-y divide-hairline">
            <Row label="Nome da plataforma">Match Service</Row>
            <Row label="E-mail de contato">contato@matchservice.exemplo.com.br <span className="adm-small text-cream/50">(demonstrativo)</span></Row>
            <Row label="Sobre">Marketplace que conecta clientes (pessoa física ou jurídica) a empresas prestadoras de serviços.</Row>
          </dl>
        </Section>

        <Section id="cfg-finance" icon="dollar" title="Parâmetros financeiros" description="Valores de demonstração, exibidos apenas para consulta." badge="Somente consulta">
          <dl className="divide-y divide-hairline">
            <Row label="Comissão da plataforma">{COMMISSION_RATE_PERCENT}% <span className="adm-small text-cream/50">(demonstrativa)</span></Row>
            <Row label="Destinado ao fornecedor">{100 - COMMISSION_RATE_PERCENT}% <span className="adm-small text-cream/50">(demonstrativo, antes de taxas e tributos)</span></Row>
            <Row label="Liberação do repasse">Após a confirmação de conclusão do serviço, conforme as regras do provedor financeiro.</Row>
          </dl>
          <p className="adm-small mt-2 rounded-xl border border-hairline bg-surface-2/60 px-3 py-2 text-cream/60">
            Estes parâmetros não podem ser editados aqui e não alteram transações, contratos ou pagamentos existentes. Mudanças futuras dependerão do backend e do provedor financeiro.
          </p>
        </Section>

        <Section id="cfg-notifications" icon="bell" title="Notificações administrativas" description="Preferências demonstrativas: funcionam nesta tela e ficam salvas só neste navegador." badge="Demonstrativo">
          <div className="divide-y divide-hairline">
            <AdminSwitch id="notify-disputes" checked={prefs.disputes} onChange={toggle("disputes", "Avisos de novas contestações")} label="Novas contestações" description="Receber avisos quando uma contestação for aberta." />
            <AdminSwitch id="notify-requests" checked={prefs.requests} onChange={toggle("requests", "Avisos de solicitações pendentes")} label="Solicitações pendentes" description="Receber avisos sobre solicitações aguardando confirmação." />
            <AdminSwitch id="notify-financial" checked={prefs.financial} onChange={toggle("financial", "Avisos de eventos financeiros")} label="Eventos financeiros relevantes" description="Receber avisos sobre pagamentos com falha ou repasses retidos." />
          </div>
          <p role="status" aria-live="polite" className="adm-small mt-2 min-h-[16px] text-emerald-400">{feedback}</p>
        </Section>

        <Section id="cfg-security" icon="lock" title="Segurança e acesso" description="Informações básicas sobre o acesso administrativo.">
          <dl className="divide-y divide-hairline">
            <Row label="Acesso ao painel">Acesso direto de demonstração, sem login.</Row>
            <Row label="Autenticação e permissões">Definitivas dependerão do backend (Django). Esta versão não protege o acesso nem gerencia senhas.</Row>
          </dl>
          <Link to="/admin/perfil" className="adm-button mt-3 inline-flex items-center gap-2 text-orange hover:underline">
            Ver perfil do administrador
            <Icon name="arrowRight" size={16} />
          </Link>
        </Section>
      </div>
    </div>
  );
}
