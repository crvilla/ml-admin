import { useEffect, useState } from 'react'
import { Message } from '@/app/dashboard/bot/types/types'

type ApiMessage = {
  id: string | number
  content: string
  sender: 'USER' | 'AI'
}

export function useChatMessages(botId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/business/bot/get_messages/bot_id/${botId}`)
      const data = await res.json()

      const parsed: Message[] = (data.messages as ApiMessage[]).map((msg) => ({
        id: Number(msg.id),
        sender: msg.sender === 'USER' ? 'user' : 'bot',
        text: msg.content,
      }))

      setMessages(parsed)
    } catch (error) {
      console.error('Error al obtener mensajes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [botId])

  return {
    messages,
    setMessages,
    loading,
    refetch: fetchMessages,
  }
}
