import SectionTitle from "../ui/SectionTitle";

/** Seção "Sobre a empresa" — descrição um pouco mais completa que a do catálogo. */
export default function SupplierAbout({ description }) {
  return (
    <section aria-labelledby="supplier-about-title">
      <SectionTitle id="supplier-about-title">Sobre a empresa</SectionTitle>
      <p className="app-text mt-1.5 max-w-3xl text-cream/70">{description}</p>
    </section>
  );
}
