// hooks/useBotChat.ts
import { useState } from 'react'
import { Message } from '@/app/dashboard/bot/types/types'
import { useChatMessages } from '@/hooks/useChatMessages'

export function useBotChat(botId: string) {
  const { messages, setMessages, loading, refetch } = useChatMessages(botId)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    setIsSending(true)
    setIsThinking(true)
    const userText = input.trim()
    setInput('')

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText,
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const res = await fetch(`/api/business/bot/get_messages/bot_id/${botId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error desconocido')

      await refetch()
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err)
      const botError: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ Ocurrió un error procesando tu mensaje. Por favor, intenta de nuevo.',
      }
      setMessages(prev => [...prev, botError])
    } finally {
      setIsSending(false)
      setIsThinking(false)
    }
  }

  return {
    messages,
    input,
    setInput,
    isSending,
    isThinking,
    loading,
    handleSend,
    refetch,
    setMessages
  }
}
