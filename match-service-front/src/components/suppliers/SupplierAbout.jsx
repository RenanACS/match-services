/**
 * Seção "Sobre a empresa" — descrição um pouco mais completa que a usada
 * no card do catálogo, sem virar texto institucional longo.
 */
export default function SupplierAbout({ description }) {
  return (
    <section aria-labelledby="supplier-about-title">
      <h2
        id="supplier-about-title"
        className="font-display text-lg font-semibold text-cream xl:text-base"
      >
        Sobre a empresa
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-cream/60 xl:mt-1 xl:leading-snug">
        {description}
      </p>
    </section>
  );
}
