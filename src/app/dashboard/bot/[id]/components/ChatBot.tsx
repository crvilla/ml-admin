'use client'

import { useEffect, useRef } from 'react'
import { RefreshCcw, Send } from 'lucide-react'
import { useBotChat } from '@/hooks/useBotChat'
import { MessageBubble } from './MessageBubble'


export default function ChatBot({ botId }: { botId: string }) {
  const {
    messages,
    input,
    setInput,
    isSending,
    isThinking,
    loading,
    handleSend,
    refetch,
  } = useBotChat(botId)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col w-full h-full">
      {/* Refrescar */}
      <div className="flex justify-end p-2">
        <button
          onClick={refetch}
          className="text-sm text-orange-500 flex items-center gap-1 hover:underline"
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
            {messages.sort((a, b) => a.id - b.id).map((msg) => (
              <MessageBubble key={msg.id} text={msg.text} sender={msg.sender} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
        {isThinking && (
          <MessageBubble text={'Mailo está escribiendo...'} sender="bot" />
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-300 bg-white p-3 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition disabled:opacity-50"
        >
          {isSending ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  )
}
