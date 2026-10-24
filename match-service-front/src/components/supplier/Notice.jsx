/** Aviso curto de confirmação (ex.: "Serviço salvo"). */
export default function Notice({ children, tone = "success" }) {
  if (!children) return null;
  const toneClass =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : "border-red-500/30 bg-red-500/10 text-red-400";
  return (
    <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${toneClass}`}>
      {children}
    </p>
  );
}
