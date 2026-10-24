/**
 * Tabela responsiva: tabela a partir de md; abaixo disso, cada linha vira um
 * cartão empilhado. Colunas: { key, label, render(row), align?, mobile? }
 * `mobile`: "title" (cabeçalho do cartão), "actions" (rodapé do cartão) ou
 * omitido (linha "rótulo: valor"). A coluna de ações usa `label` "Ações".
 */
export default function DataTable({ columns, rows, rowKey, emptyMessage }) {
  if (rows.length === 0) {
    return <p className="px-6 py-10 text-center app-text text-cream/70">{emptyMessage}</p>;
  }

  const title = columns.find((column) => column.mobile === "title");
  const actions = columns.find((column) => column.mobile === "actions");
  const details = columns.filter((column) => !column.mobile);

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left app-text">
          <thead>
            <tr className="border-y border-hairline app-small font-medium text-cream/70">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-3 font-medium first:pl-6 last:pr-6 ${column.align === "right" ? "text-right" : ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-3 py-3 first:pl-6 last:pr-6 ${column.align === "right" ? "text-right" : ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-hairline border-t border-hairline md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="flex flex-col gap-3 px-5 py-4">
            {title && <div>{title.render(row)}</div>}
            <dl className="flex flex-col gap-1.5">
              {details.map((column) => (
                <div key={column.key} className="flex items-center justify-between gap-4">
                  <dt className="app-small font-medium text-cream/70">
                    {column.label}
                  </dt>
                  <dd className="min-w-0 text-right text-cream/85">{column.render(row)}</dd>
                </div>
              ))}
            </dl>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions.render(row)}</div>}
          </li>
        ))}
      </ul>
    </>
  );
}
