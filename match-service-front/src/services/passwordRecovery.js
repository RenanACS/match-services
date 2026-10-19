// Recuperação de senha — DEMONSTRATIVA. Não há Back-End: nada é enviado,
// nenhum token é gerado e nada é guardado no navegador.
//
// Integração futura com o Django (substituir só o corpo desta função):
//   await api.post("/auth/password-reset/", { email });
// O servidor deve gerar o token seguro, enviar o link temporário (com
// expiração), e responder SEMPRE com a mesma mensagem genérica, exista ou
// não cadastro para o e-mail. A página de definição da nova senha
// (ex.: /redefinir-senha/:token) será uma etapa posterior.

export const RECOVERY_DEMO_MESSAGE =
  "Solicitação demonstrativa registrada. O envio de e-mails estará disponível após a integração com o sistema de autenticação.";

export async function requestPasswordRecovery(email) { // eslint-disable-line no-unused-vars
  return { message: RECOVERY_DEMO_MESSAGE };
}
