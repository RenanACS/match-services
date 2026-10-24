const TONES = {
  amber: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  red: "border-red-500/30 bg-red-500/15 text-red-400",
  zinc: "border-zinc-400/30 bg-zinc-400/15 text-zinc-300",
};

export default function TonePill({ tone = "zinc", children }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 adm-small font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
