import { useState } from "react";
import Icon from "../../AdminIcons";
import { SupplierStatusBadge } from "../SupplierBadges";
import { lastEntry } from "./helpers";
import { formatDate, formatDateTime } from "../../../../utils/dates";
import { formatBRL } from "../../../../utils/currency";

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="adm-small text-cream/70">{label}</dt>
      <dd className="mt-0.5 break-words adm-text text-cream">{children}</dd>
    </div>
  );
}

function statusMessage(supplier) {
  const { status, history } = supplier;
  if (status === "review") {
    return "Cadastro aguardando análise da equipe administrativa. Confira os dados e os documentos antes de decidir.";
  }
  if (status === "active") {
    const entry = lastEntry(history, "approved");
    return `Cadastro aprovado${entry ? ` em ${formatDate(entry.date)}` : ""}.`;
  }
  if (status === "blocked") {
    const entry = lastEntry(history, "blocked");
    return `Fornecedor bloqueado${entry ? ` em ${formatDate(entry.date)}` : ""}. O bloqueio impede novas contratações, mas não cancela serviços já contratados, pagamentos ou obrigações existentes.${entry?.reason ? ` Motivo: ${entry.reason}` : ""}`;
  }
  const entry = lastEntry(history, "rejected");
  return `Cadastro rejeitado${entry ? ` em ${formatDate(entry.date)}` : ""}.${entry?.reason ? ` Motivo: ${entry.reason}` : ""}`;
}

/** Visão geral: dados cadastrais (somente consulta), status do cadastro e serviços. */
export default function OverviewTab({ supplier, onSeeServices }) {
  const [correctionNotice, setCorrectionNotice] = useState(false);
  const { address } = supplier;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      <div className="flex flex-col gap-5">
        <section aria-labelledby="company-info" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 id="company-info" className="adm-section-title">Informações da empresa</h2>
            <button
              type="button"
              onClick={() => setCorrectionNotice(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-hairline px-3 py-1.5 adm-text text-cream/80 transition hover:border-orange/60 hover:text-cream"
            >
              <Icon name="flag" size={14} /> Solicitar correção
            </button>
          </div>
          {correctionNotice && (
            <p role="status" className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 adm-small text-amber-300">
              Solicitação de correção apenas demonstrativa: nada foi enviado ao fornecedor. A alteração dos dados
              cadastrais será feita pelo próprio fornecedor quando o sistema estiver integrado.
            </p>
          )}
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <Field label="Razão social">{supplier.name}</Field>
            <Field label="Nome fantasia">{supplier.tradeName}</Field>
            <Field label="CNPJ">{supplier.cnpj}</Field>
            <Field label="Inscrição estadual">{supplier.stateRegistration ?? "Isento / não informada"}</Field>
            <Field label="Telefone">{supplier.phone}</Field>
            <Field label="E-mail">{supplier.email}</Field>
            <Field label="Endereço">
              {address.street}, {address.number} – {address.district}
              <br />
              {address.city} – {address.state}, {address.cep}
            </Field>
            <Field label="Categoria">{supplier.category}</Field>
            <Field label="Data de cadastro">{formatDateTime(supplier.registeredAt)}</Field>
          </dl>
          <p className="mt-4 adm-small text-cream/70">
            Somente consulta: o administrador não edita livremente os dados cadastrais do fornecedor.
          </p>
        </section>

        <section aria-labelledby="about-company" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
          <h2 id="about-company" className="adm-section-title">Sobre a empresa</h2>
          <p className="mt-3 rounded-xl border border-hairline bg-surface-2 px-4 py-3 adm-text leading-relaxed text-cream/80">
            {supplier.about}
          </p>
        </section>
      </div>

      <div className="flex flex-col gap-5">
        <section aria-labelledby="registration-status" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="registration-status" className="adm-section-title">Status do cadastro</h2>
            <SupplierStatusBadge status={supplier.status} />
          </div>
          <p className="mt-3 adm-text leading-relaxed text-cream/70">{statusMessage(supplier)}</p>
        </section>

        <section aria-labelledby="offered-services" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="offered-services" className="adm-section-title">Serviços oferecidos</h2>
            <button type="button" onClick={onSeeServices} className="adm-text text-orange transition hover:text-orange-light">
              Ver todos
            </button>
          </div>
          <ul className="mt-3 divide-y divide-hairline">
            {supplier.services.map((service) => (
              <li key={service.id} className="py-3 first:pt-0 last:pb-0">
                <p className="adm-text font-medium text-cream">{service.name}</p>
                <p className="mt-0.5 adm-small text-cream/70">{service.description}</p>
                <p className="mt-1 adm-small text-cream/70">
                  {service.priceCents === null ? "Sob orçamento" : `A partir de ${formatBRL(service.priceCents)}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
