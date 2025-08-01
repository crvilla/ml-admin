'use client'

import { useEffect, useState } from 'react'
import { Bot, WhatsappConfig } from '../../types/types'

export default function BotConfigForm({ botId }: { botId: string }) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [webhookURL, setWebhookURL] = useState('')
  const [webhookTestURL, setWebhookTestURL] = useState('')
  const [whatsappConfigId, setWhatsappConfigId] = useState('')
  const [wsConfigs, setWsConfigs] = useState<WhatsappConfig[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const res = await fetch(`/api/business/bot/id/${botId}`)
        if (!res.ok) throw new Error('Error al cargar bot')
        const data = await res.json()
        setBot(data)
        setName(data.name)
        setDescription(data.description || '')
        setWebhookURL(data.webhookURL)
        setWebhookTestURL(data.webhookTestURL || '')
        setWhatsappConfigId(data.whatsappConfig.id)

        const wsRes = await fetch(`/api/business/whatsapp/business/${data.businessId}`)
        if (!wsRes.ok) throw new Error('Error al cargar configuraciones de WhatsApp')
        const configs = await wsRes.json()
        setWsConfigs(configs)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchBot()
  }, [botId])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/business/bot/id/${botId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          webhookURL,
          webhookTestURL,
          whatsappConfigId,
        }),
      })

      if (!res.ok) throw new Error('Error al actualizar bot')
      const updated = await res.json()
      setBot(updated)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-gray-600">Cargando bot...</p>
  if (!bot) return <p className="text-sm text-red-600">Bot no encontrado</p>

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
        <input
          type="text"
          value={webhookURL}
          onChange={(e) => setWebhookURL(e.target.value)}
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook de prueba (opcional)</label>
        <input
          type="text"
          value={webhookTestURL}
          onChange={(e) => setWebhookTestURL(e.target.value)}
          className="w-full border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-2 text-sm shadow-sm transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Configuracion de  WhatsApp</label>
        <select
          value={whatsappConfigId}
          onChange={(e) => setWhatsappConfigId(e.target.value)}
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition"
        >
          {wsConfigs.map((config) => (
            <option key={config.id} value={config.id}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-xl shadow transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Actualizar Bot'}
        </button>
      </div>
    </div>
  )
}
