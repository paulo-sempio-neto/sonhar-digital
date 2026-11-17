export const questions = [
  {
    text: "A mensagem pede dinheiro ou uma transferência?",
    alert: "Sim",
    advice:
      "Não faça o pagamento agora. Fale com a pessoa por um contato que você já usava.",
  },
  {
    text: "Alguém pediu sua senha, um código ou uma foto de documento?",
    alert: "Sim",
    advice:
      "Não envie esses dados na conversa. Abra o aplicativo oficial por conta própria.",
  },
  {
    text: "A pessoa exige pressa, segredo ou ameaça bloquear algo?",
    alert: "Sim",
    advice:
      "Reserve um tempo para conferir. A pressão para agir é um sinal de alerta.",
  },
  {
    text: "Você precisa abrir um link ou instalar um aplicativo recebido na mensagem?",
    alert: "Sim",
    advice:
      "Não abra o link nem instale o aplicativo. Procure o serviço pelo caminho que você já conhece.",
  },
  {
    text: "Você conseguiu confirmar o pedido por outro canal que já conhecia?",
    alert: "Não",
    advice:
      "Ligue para um número que já estava nos seus contatos ou procure o atendimento oficial.",
  },
];

export function getChecklistStatus(answers) {
  const answered = questions.filter((_, i) => answers[i] !== undefined).length;
  const alert = questions.some(
    (q, i) => answers[i] === q.alert || answers[i] === "Não sei",
  );
  return {
    answered,
    alert,
    title: alert
      ? "Pare e confirme antes de continuar"
      : answered === questions.length
        ? "Continue conferindo com cuidado"
        : "Vamos conferir, com calma",
    message: alert
      ? "Há um sinal de alerta ou uma dúvida. Não pague, não abra links e não compartilhe dados. Confirme por um canal que você já conhece."
      : answered === questions.length
        ? "Este checklist não comprova que a mensagem é segura. Antes de agir, confira o pedido no aplicativo oficial ou com a pessoa por um contato conhecido."
        : "Responda às cinco perguntas. Se não tiver certeza, escolha “Não sei”. Você pode mudar qualquer resposta.",
  };
}
