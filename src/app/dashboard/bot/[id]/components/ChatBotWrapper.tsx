'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import ChatBot from './ChatBot'
import { Bot } from '../../types/types'

export default function ChatBotWrapper({ botId }: { botId: string }) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBot = async () => {
    try {
      setRefreshing(true)
      const res = await fetch(`/api/business/bot/id/${botId}`)
      if (!res.ok) throw new Error('No se pudo cargar el bot')
      const data = await res.json()
      setBot(data)
    } catch (error) {
      console.error('[ChatBotWrapper] Error al cargar el bot', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBot()
  }, [botId])

  if (loading) return <p className="text-sm text-gray-600">Cargando bot...</p>

  if (!bot?.simulatedPhone) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 text-gray-700 space-y-4">
        <AlertTriangle className="w-10 h-10 text-orange-500" />
        <div>
          <p className="text-lg font-semibold mb-1">Agrega un número para simular</p>
          <p className="text-sm max-w-md">
            Ve a la pestaña <strong className="text-orange-600">Bot</strong> del lado derecho y agrega un número de simulación para cargar el historial de chat.
          </p>
        </div>
        <button
          onClick={fetchBot}
          disabled={refreshing}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualizando...' : 'Refrescar'}
        </button>
      </div>
    )
  }

  // ChatBotWrapper.tsx
  return <ChatBot botId={botId} />

}
