export default function DashboardHeader({ name }) {
  return (
    <header>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl xl:text-2xl">
        Olá, {name}
      </h1>
      <p className="mt-2 max-w-xl text-base text-cream/60 xl:mt-1 xl:text-sm">
        Encontre fornecedores e resolva sua contratação em um só lugar.
      </p>
    </header>
  );
}
