import { useEffect, useState, useCallback } from 'react'
import { ApiResponse, Message } from '@/app/dashboard/bot/types/types'

export function useChatMessages(botId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/business/bot/get_messages/bot_id/${botId}`)
      if (!res.ok) throw new Error('No se pudo obtener historial')

      const data: ApiResponse = await res.json()
      const mapped: Message[] = (data.messages || []).reverse().map((m) => ({
        sender: m.sender === 'AI' ? 'bot' : 'user',
        text: m.content,
      }))

      setMessages(mapped.length > 0 ? mapped : [{
        sender: 'bot',
        text: '¡Hola! Soy Lukran, ¿en qué puedo ayudarte hoy?',
      }])
    } catch (err) {
      console.error('[useChatMessages] Error al cargar mensajes:', err)
      setMessages([{ sender: 'bot', text: '¡Hola! Soy Lukran, ¿en qué puedo ayudarte hoy?' }])
    } finally {
      setLoading(false)
    }
  }, [botId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return { messages, setMessages, loading, refetch: fetchMessages }
}
