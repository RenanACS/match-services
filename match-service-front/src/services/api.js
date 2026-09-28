// Cliente HTTP fino para o futuro backend Django.
// Usa o proxy já configurado em vite.config.js (/api -> http://127.0.0.1:8000).
// Nenhuma regra de negócio deve viver aqui — só a mecânica de request.

const BASE_URL = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`API ${options.method ?? "GET"} ${path} -> ${response.status}: ${message}`);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
