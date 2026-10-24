import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { recentRequests, REQUEST_STATUS } from "../../data/dashboard";
import { payments } from "../../data/payments";
import { getRequestProposals, formatProposalAmount } from "../../data/proposals";
import { formatRequestDate } from "../../components/solicitacoes/RequestsList";
import { hasRequestApi, confirmRequestCompletion, readDemoCompletions, saveDemoCompletion } from "../../services/requestCompletion";
import { readDemoProposalAcceptances, saveDemoProposalAcceptance } from "../../services/proposalAcceptance";

const card = "rounded-[20px] border border-hairline bg-surface-1 p-5 sm:p-6";
const label = "app-small text-cream/70";
const value = "app-text mt-1 text-cream";

function Detail({ title, children }) {
  return <div><dt className={label}>{title}</dt><dd className={value}>{children}</dd></div>;
}

function Timeline({ status, completed }) {
  const steps = [
    { key: "created", title: "Solicitação enviada", text: "Pedido registrado na plataforma." },
    { key: "analysis", title: "Análise e propostas", text: "Análise do pedido e recebimento de propostas." },
    { key: "hired", title: "Serviço contratado", text: "Acompanhamento da execução do serviço." },
    { key: "completed", title: "Conclusão confirmada", text: "Confirmação registrada pelo cliente." },
  ];
  const progress = completed ? 4 : status === "hired" ? 3 : status === "proposals" ? 2 : 1;
  return <ol className="mt-5 space-y-0">
    {steps.map((step, index) => {
      const reached = index < progress;
      return <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
        {index !== steps.length - 1 && <span aria-hidden="true" className="absolute left-[13px] top-7 h-[calc(100%-22px)] w-px bg-hairline" />}
        <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${reached ? "border-orange bg-orange-soft text-orange" : "border-hairline text-cream/70"}`}>
          {reached ? <Icon name="check" size={14} /> : <span className="text-xs">{index + 1}</span>}
        </span>
        <div><p className={`app-text font-medium ${reached ? "text-cream" : "text-cream/70"}`}>{step.title}</p><p className="app-small mt-0.5 text-cream/70">{step.text}</p></div>
      </li>;
    })}
  </ol>;
}

function ConfirmDialog({ pending, error, onCancel, onConfirm }) {
  useEffect(() => {
    function onKey(event) { if (event.key === "Escape" && !pending) onCancel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, pending]);
  return <div role="dialog" aria-modal="true" aria-labelledby="completion-confirm-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={pending ? undefined : onCancel}>
    <div className="w-full max-w-md rounded-[20px] border border-hairline bg-surface-1 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <h2 id="completion-confirm-title" className="app-section-title text-cream">Confirmar conclusão do serviço?</h2>
      <p className="app-text mt-3 leading-relaxed text-cream/70">Confirme apenas depois de verificar que o serviço contratado foi integralmente realizado e está de acordo com o combinado.</p>
      <p className="app-small mt-3 rounded-xl border border-orange/30 bg-orange-soft p-3 text-orange">{hasRequestApi ? "Sua confirmação será enviada à plataforma. A liberação financeira depende de validações no servidor e no provedor de pagamento." : "Modo demonstração: esta ação ficará registrada apenas neste navegador. Nenhum pagamento real será liberado."}</p>
      {error && <p role="alert" className="app-small mt-3 text-red-400">{error}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="secondary" appearance="app" disabled={pending} onClick={onCancel}>Cancelar</Button>
        <Button type="button" appearance="app" disabled={pending} onClick={onConfirm}>{pending ? "Confirmando..." : "Sim, serviço concluído"}</Button>
      </div>
    </div>
  </div>;
}

function AcceptProposalDialog({ proposal, requestTitle, onCancel, onConfirm, error }) {
  useEffect(() => {
    function onKey(event) { if (event.key === "Escape") onCancel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return <div role="dialog" aria-modal="true" aria-labelledby="accept-proposal-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={onCancel}>
    <div className="w-full max-w-md rounded-[20px] border border-hairline bg-surface-1 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <h2 id="accept-proposal-title" className="app-section-title text-cream">Aceitar esta proposta?</h2>
      <dl className="mt-4 space-y-3">
        <Detail title="Serviço">{requestTitle}</Detail>
        <Detail title="Empresa proponente">{proposal.supplierName}</Detail>
        <Detail title="Valor proposto"><strong className="text-orange">{formatProposalAmount(proposal.amountCents)}</strong></Detail>
      </dl>
      <p className="app-small mt-4 rounded-xl border border-orange/30 bg-orange-soft p-3 text-orange">Aceite demonstrativo: será salvo apenas neste navegador. Não gera contrato, cobrança, pagamento ou retenção de valores. A contratação real dependerá da integração com o backend.</p>
      {error && <p role="alert" className="app-small mt-3 text-red-400">{error}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="secondary" appearance="app" onClick={onCancel}>Cancelar</Button>
        <Button type="button" appearance="app" onClick={onConfirm}>Confirmar aceite demonstrativo</Button>
      </div>
    </div>
  </div>;
}

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const request = recentRequests.find((item) => item.id === id);
  const [demoCompletions, setDemoCompletions] = useState(readDemoCompletions);
  const [demoAcceptances, setDemoAcceptances] = useState(readDemoProposalAcceptances);
  const [proposalToAccept, setProposalToAccept] = useState(null);
  const [acceptError, setAcceptError] = useState("");
  const [serverConfirmation, setServerConfirmation] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const confirmedAt = serverConfirmation?.confirmed_at || (!hasRequestApi && demoCompletions[id]);
  const completed = Boolean(confirmedAt);
  const linkedPayment = payments.find((item) => item.service === request?.title);
  const proposals = getRequestProposals(id);
  const acceptedProposal = demoAcceptances[id];

  function handleAcceptProposal() {
    if (!request || request.status !== "proposals" || !proposalToAccept || acceptedProposal) return;
    try {
      const acceptance = saveDemoProposalAcceptance(request.id, proposalToAccept);
      setDemoAcceptances((current) => ({ ...current, [request.id]: acceptance }));
      setProposalToAccept(null);
      setAcceptError("");
    } catch (err) {
      setAcceptError(err.message || "Não foi possível registrar o aceite.");
    }
  }


  async function handleConfirm() {
    if (!request || request.status !== "hired" || completed || pending) return;
    setPending(true); setError("");
    try {
      if (hasRequestApi) {
        const response = await confirmRequestCompletion(request.id);
        setServerConfirmation(response);
      } else {
        const timestamp = saveDemoCompletion(request.id);
        setDemoCompletions((prev) => ({ ...prev, [request.id]: timestamp }));
      }
      setConfirmOpen(false);
    } catch (err) { setError(err.message || "Erro ao confirmar."); }
    finally { setPending(false); }
  }

  if (!request) return <div className="mx-auto max-w-5xl"><div className={card}><h1 className="app-page-title">Solicitação não encontrada</h1><p className="app-text mt-3 text-cream/70">Não encontramos uma solicitação com este identificador.</p><Link className="app-text mt-5 inline-block text-orange" to="/app/solicitacoes">Voltar para solicitações</Link></div></div>;

  const status = completed ? { label: "Concluído", variant: "success" } : acceptedProposal && request.status === "proposals" ? { label: "Aguardando pagamento", variant: "warning" } : REQUEST_STATUS[request.status];
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="app-small text-cream/70">Solicitação {request.id}</p><h1 className="app-page-title mt-1 text-cream">{request.title}</h1></div><Badge appearance="app" variant={status.variant}>{status.label}</Badge></header>
    {!hasRequestApi && <div className="app-small rounded-xl border border-orange/30 bg-orange-soft px-4 py-3 text-orange">Ambiente demonstrativo: dados e acompanhamento ilustrativos. Não há contratação ou movimentação financeira real nesta tela.</div>}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-4">
        <section className={card}><h2 className="app-section-title text-cream">Detalhes da solicitação</h2><dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2"><Detail title="Serviço">{request.title}</Detail><Detail title="Categoria">{request.category}</Detail><Detail title="Data da solicitação">{formatRequestDate(request.date)}</Detail><Detail title="Identificador">{request.id}</Detail></dl></section>
        <section className={card}><h2 className="app-section-title text-cream">{request.status === "hired" ? "Acompanhamento do serviço" : "Andamento da solicitação"}</h2><Timeline status={request.status} completed={completed} /></section>
      </div>
      <div className="flex flex-col gap-4">
        {request.status === "analysis" && <section className={card}><h2 className="app-section-title text-cream">Pedido em análise</h2><p className="app-text mt-3 leading-relaxed text-cream/70">Sua solicitação está em análise. Quando houver propostas, você poderá consultá-las nesta área.</p><p className="app-small mt-3 text-cream/70">Ainda não há propostas vinculadas a este registro demonstrativo.</p></section>}
        {request.status === "proposals" && <section className={card}>
          <h2 className="app-section-title text-cream">Propostas recebidas</h2>
          {proposals.length === 0 ? (
            <p className="app-text mt-3 text-cream/70">Nenhuma proposta individual cadastrada para esta solicitação.</p>
          ) : proposals.map((proposal) => (
            <article key={proposal.id} className="mt-4 min-w-0">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail title="Empresa proponente">{proposal.supplierName}</Detail>
                <Detail title="Valor da proposta"><span className="font-semibold text-orange">{formatProposalAmount(proposal.amountCents)}</span></Detail>
              </dl>
              <p className="app-small mt-4 text-cream/70">Documento demonstrativo do fornecedor, em formato PDF.</p>
              {proposal.pdfUrl ? (
                <div className="mt-3 min-w-0 overflow-hidden rounded-xl border border-hairline bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-surface-2 px-3 py-2">
                    <span className="app-small min-w-0 truncate text-cream/75">{proposal.fileName}</span>
                    <a href={proposal.pdfUrl} target="_blank" rel="noopener noreferrer" className="app-small font-medium text-orange hover:underline">Abrir PDF em nova aba ↗</a>
                  </div>
                  <iframe
                    title={`Proposta em PDF de ${proposal.supplierName}`}
                    src={`${proposal.pdfUrl}#toolbar=1&navpanes=0`}
                    className="h-[360px] w-full sm:h-[460px]"
                    loading="lazy"
                  />
                  <p className="app-small bg-surface-2 px-3 py-2 text-cream/70">Caso a prévia não carregue, use “Abrir PDF em nova aba”.</p>
                </div>
              ) : <p className="app-small mt-3 text-cream/70">Nenhum PDF anexado a esta proposta.</p>}
              {acceptedProposal?.proposalId === proposal.id ? (
                <div role="status" className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="app-text font-medium text-emerald-400"><Icon name="checkCircle" size={16} className="inline" /> Proposta aceita (demonstração)</p>
                  <p className="app-small mt-2 text-cream/70">Aguardando pagamento. Nenhuma cobrança ou contratação real foi realizada.</p>
                  <Link to="/app/pagamento" className="app-text mt-3 inline-flex items-center gap-2 text-orange hover:underline">Ir para Pagamento <Icon name="arrowRight" size={15} /></Link>
                </div>
              ) : acceptedProposal ? (
                <p className="app-small mt-4 text-cream/70">Outra proposta desta solicitação já foi selecionada no modo demonstração.</p>
              ) : (
                <Button type="button" appearance="app" className="mt-4 w-full" onClick={() => { setAcceptError(""); setProposalToAccept(proposal); }}>Aceitar proposta</Button>
              )}
              {proposal.illustrative && <p className="app-small mt-3 text-cream/70">Dados e documento fictícios, apenas para demonstração. Não representam uma oferta real.</p>}
            </article>
          ))}
        </section>}
        {request.status === "hired" && <section className={card}><h2 className="app-section-title text-cream">Confirmação da execução</h2>{completed ? <><p className="app-text mt-3 text-emerald-400"><Icon name="checkCircle" size={16} className="inline" /> Conclusão confirmada</p><p className="app-small mt-2 text-cream/70">Registrada em {new Date(confirmedAt).toLocaleString("pt-BR")}.</p><p className="app-small mt-3 text-cream/70">{hasRequestApi ? "Confirmação enviada ao servidor. Consulte o status financeiro na plataforma; a transferência não é garantida por esta mensagem." : "Confirmação de demonstração salva neste navegador. Nenhuma transferência foi realizada."}</p></> : <><p className="app-text mt-3 leading-relaxed text-cream/70">Quando o fornecedor terminar o serviço, confirme a entrega somente após verificar o resultado.</p><Button type="button" appearance="app" className="mt-5 w-full" onClick={() => { setError(""); setConfirmOpen(true); }}><Icon name="checkCircle" size={17} /> Confirmar conclusão do serviço</Button><p className="app-small mt-3 text-cream/70">Após a confirmação, o backend deverá validar a operação e iniciar a liberação do pagamento retido, conforme as regras da plataforma.</p></>}</section>}
        {request.status === "hired" && <section className={card}><h2 className="app-section-title text-cream">Pagamento e fornecedor</h2>{linkedPayment ? <dl className="mt-4 space-y-4"><Detail title="Fornecedor (dados demonstrativos)">{linkedPayment.company}</Detail><Detail title="Valor associado ao serviço">{(linkedPayment.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Detail><Detail title="Situação do registro de pagamento">{linkedPayment.status === "paid" ? "Pago pelo cliente (demonstração)" : "Pendente"}</Detail></dl> : <p className="app-text mt-3 text-cream/70">Os dados do fornecedor e do pagamento estarão disponíveis quando vinculados à solicitação no backend.</p>}<p className="app-small mt-4 text-cream/70">“Pago” não significa que o fornecedor já recebeu. O status de retenção e repasse depende do provedor financeiro.</p><Link to="/app/pagamento" className="app-text mt-4 inline-flex items-center gap-2 text-orange hover:underline">Ver meus pagamentos <Icon name="arrowRight" size={15} /></Link></section>}
        <Link to="/app/solicitacoes" className="app-text inline-flex items-center gap-2 self-start text-cream/70 transition hover:text-orange"><Icon name="chevronLeft" size={16} /> Voltar às solicitações</Link>
      </div>
    </div>
    {confirmOpen && <ConfirmDialog pending={pending} error={error} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirm} />}
    {proposalToAccept && <AcceptProposalDialog proposal={proposalToAccept} requestTitle={request.title} error={acceptError} onCancel={() => setProposalToAccept(null)} onConfirm={handleAcceptProposal} />}
  </div>;
}
