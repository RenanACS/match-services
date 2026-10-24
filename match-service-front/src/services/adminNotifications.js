// Notificações do Admin. Ainda NÃO existe backend: a lista é sempre vazia e
// nenhuma notificação fictícia é exibida. Com o Django, esta função passa a
// chamar a API (ex.: GET /api/admin/notifications/) e devolver itens no
// formato { id, title, text, createdAt, read, to }.
export function listNotifications() {
  return [];
}
