'use client'

import { BotMessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

type Props = {
  businessApiId: string
}

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'DISABLED']

type Bot = {
  id: string
  name: string
}

export default function BusinessApiChatConfigCard({ businessApiId }: Props) {
  const [publicApiKey, setPublicApiKey] = useState('')
  const [status, setStatus] = useState('')
  const [selectedBot, setSelectedBot] = useState('')
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/business/api_integration/id/${businessApiId}`)
        if (!res.ok) throw new Error('Error al obtener datos de la API')
        const data = await res.json()

        setPublicApiKey(data.publicApiKey || '')
        setStatus(data.status || 'ACTIVE')
        setSelectedBot(data.bot?.id || '')

        const botsRes = await fetch(`/api/business/bot/bot_business/${data.business.id}`)
        if (!botsRes.ok) throw new Error('Error al obtener los bots')
        const botsData = await botsRes.json()

        setBots(botsData)
      } catch (error) {
        console.error('❌ Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (businessApiId) {
      fetchData()
    }
  }, [businessApiId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/business/api_integration/id/${businessApiId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          botId: selectedBot || null,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al guardar configuración')
      }

      const updatedData = await res.json()
      console.log('✅ Configuración guardada:', updatedData)

      toast.success('Integración activada correctamente')
    } catch (error) {
      console.error('❌ Error al guardar:', error)
      alert(`Error: ${(error as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">
        Configuración de <span className="text-orange-500">API de Chats</span>
      </h2>

      <div>
        <label className="text-gray-700 text-sm font-medium mb-1 block">API Key Pública</label>
        <input
          readOnly
          value={publicApiKey}
          className="w-full px-3 py-2 rounded border text-sm text-gray-800 bg-gray-50 border-gray-300 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-gray-700 text-sm font-medium mb-1 block">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 rounded border text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {bots.length === 0 ? (
        <div className="text-center text-orange-600 font-semibold text-sm mt-2">
          ⚠️ Este negocio aún no tiene un bot creado. <br />
          <span className="text-orange-500 font-bold">Crea un bot</span> para asociarlo a la API.
        </div>
      ) : (
        <div>
          <label className="text-gray-700 text-sm font-medium mb-1 block">Bot asociado</label>
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="w-full px-3 py-2 rounded border text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Seleccione un bot</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </select>

          {selectedBot && (
            <div className="mt-4 border border-orange-500 rounded-lg p-4 flex items-center space-x-3">
              <BotMessageSquare className="text-orange-500 w-10 h-10 mt-1" />
              <span className="text-orange-500 font-semibold">
                Bot asignado: {bots.find((b) => b.id === selectedBot)?.name || 'Nombre no disponible'}
              </span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full mt-4 px-4 py-2 text-sm font-semibold rounded text-white transition ${
          saving ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {saving ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </div>
  )
}
