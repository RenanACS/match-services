/** Envolve um Input/Select/Textarea e mostra a mensagem de erro abaixo. */
export default function FormField({ error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
