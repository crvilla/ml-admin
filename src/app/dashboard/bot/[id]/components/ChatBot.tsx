'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, RefreshCcw } from 'lucide-react'
import { Message } from '@/app/dashboard/bot/types/types'
import { useChatMessages } from '@/hooks/useChatMessages'

export default function ChatBot({ botId }: { botId: string }) {
  const { messages, setMessages, loading, refetch } = useChatMessages(botId)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
      if (!input.trim()) return
      setIsSending(true)

      const userText = input.trim()
      setInput('')

      const userMessage: Message = {
        id: Date.now(), // temporal
        sender: 'user',
        text: userText,
      }

      setMessages(prev => [...prev, userMessage])
      console.log('📤 Mensaje enviado (simulado):', { botId, message: userText })

      setTimeout(() => {
        const botReply: Message = {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Simulación de respuesta de Lukran 💡',
        }
        setMessages(prev => [...prev, botReply])
        setIsSending(false)
      }, 1000)
    }


  return (
    <div className="flex flex-col w-full h-full">
      {/* Botón de refresco */}
      <div className="flex justify-end p-2">
        <button
          onClick={refetch}
          className="text-sm text-orange-500 flex items-center gap-1 hover:underline"
          title="Volver a cargar mensajes"
        >
          <RefreshCcw size={14} />
          Refrescar
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-sm text-gray-600">Cargando historial...</p>
        ) : (
          <>
            {[...messages]
              .sort((a, b) => a.id - b.id)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-300 bg-white p-3 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isSending}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
