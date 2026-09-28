/**
 * Painel/card base das telas internas. Radius ~20px (maior que os
 * inputs/botões, ~12px) e superfície um pouco acima do fundo, seguindo
 * a hierarquia de superfícies definida para o produto.
 */
export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-[20px] border border-hairline bg-surface-1 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
