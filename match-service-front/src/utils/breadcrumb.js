// Monta a trilha de navegação a partir da URL atual, sem biblioteca extra.
// `labels` mapeia o segmento da rota para o nome amigável. Segmentos sem
// nome (ex.: o id em /solicitacoes/2847) são tratados por `dynamicLabel(segmento, segmentos, indice)`;
// se ele devolver null, o segmento não vira um nível da trilha.
export function buildCrumbs({ pathname, basePath, rootLabel, labels, dynamicLabel }) {
  const rest = pathname.slice(basePath.length).split("/").filter(Boolean);
  const crumbs = [{ label: rootLabel, to: basePath }];
  let current = basePath;

  rest.forEach((segment, index) => {
    current = `${current}/${segment}`;
    const label = labels[segment] ?? dynamicLabel?.(segment, rest, index) ?? null;
    if (label) crumbs.push({ label, to: current });
  });

  return crumbs;
}
