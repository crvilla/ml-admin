export function getThinkingMessage(): string {
  const thinkingMessages = [
    '✍️ Estoy revisando tu mensaje...',
    '🔎 Analizando lo que me escribiste...',
    '🧠 Procesando tu información, un momento...',
  ]
  return thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]
}
