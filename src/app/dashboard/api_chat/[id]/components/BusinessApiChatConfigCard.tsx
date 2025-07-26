'use client'

import { useState, useEffect } from 'react'

type Props = {
  businessApiId: string
}

const BOT_OPTIONS = [
  { id: 'bot_01', name: 'Asistente Virtual' },
  { id: 'bot_02', name: 'Ventas Express' },
  { id: 'bot_03', name: 'Soporte Proactivo' },
]

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'DISABLED']

export default function BusinessApiChatConfigCard({ businessApiId }: Props) {
  // Luego se hace fetch con businessApiId
  const [publicApiKey] = useState('pk_12345_lukran_fake_key')
  const [status, setStatus] = useState('ACTIVE')
  const [selectedBot, setSelectedBot] = useState('bot_02')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    console.log('📡 businessApiId:', businessApiId)
    // Aquí luego puedes hacer fetch a 
  }, [businessApiId])

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      console.log('🔐 Guardado:', { publicApiKey, status, selectedBot })
      setSaving(false)
    }, 1000)
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

      <div>
        <label className="text-gray-700 text-sm font-medium mb-1 block">Bot asociado</label>
        <select
          value={selectedBot}
          onChange={(e) => setSelectedBot(e.target.value)}
          className="w-full px-3 py-2 rounded border text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {BOT_OPTIONS.map((bot) => (
            <option key={bot.id} value={bot.id}>
              {bot.name}
            </option>
          ))}
        </select>
      </div>

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
