// Armazenamento local DEMONSTRATIVO (localStorage). Não é banco de dados: vale
// só para este navegador, pode estar bloqueado (modo privado) e some ao limpar
// os dados do site. Toda leitura/escrita fica em try/catch e a tela funciona
// normalmente sem ele (o estado continua na memória durante a sessão).
export function loadDemoState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveDemoState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
