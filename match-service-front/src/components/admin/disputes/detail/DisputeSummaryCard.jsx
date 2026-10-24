import AdminSectionTitle from "../../AdminSectionTitle";
import DisputeStatusBadge from "../DisputeBadges";
import { dateOf, timeOf } from "../../requests/RequestParts";
import { DISPUTE_REASONS } from "../../../../services/adminDisputes";

function Fact({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="adm-small text-cream/70">{label}</dt>
      <dd className="adm-text mt-1 text-cream">{children}</dd>
    </div>
  );
}

/** Resumo: ID, abertura, situação, motivo e a descrição do problema. */
export default function DisputeSummaryCard({ dispute }) {
  return (
    <section aria-labelledby="dispute-summary" className="rounded-[20px] border border-hairline bg-surface-1 p-5">
      <AdminSectionTitle id="dispute-summary" icon="disputes">Resumo da contestação</AdminSectionTitle>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="ID"><span className="font-medium">#{dispute.id}</span></Fact>
        <Fact label="Data de abertura">{dateOf(dispute.openedAt)} às {timeOf(dispute.openedAt)}</Fact>
        <Fact label="Situação"><DisputeStatusBadge status={dispute.status} /></Fact>
        <Fact label="Motivo">{DISPUTE_REASONS[dispute.reason]}</Fact>
      </dl>
      <div className="mt-4 border-t border-hairline pt-3">
        <p className="adm-small text-cream/70">Descrição do problema</p>
        <p className="adm-text mt-1 text-cream/90">{dispute.problem}</p>
      </div>
    </section>
  );
}
