'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { WhatsappConfig } from '../../types/types'

type Props = {
  businessId: string
  onCreated: () => void
  onCancel: () => void
}

export default function BotCreateForm({ businessId, onCreated, onCancel }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [webhookURL, setWebhookURL] = useState('')
  const [webhookTestURL, setWebhookTestURL] = useState('')
  const [whatsappConfigId, setWhatsappConfigId] = useState('')
  const [configs, setConfigs] = useState<WhatsappConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`/api/business/whatsapp/business/${businessId}`)
        if (!res.ok) throw new Error('Error al obtener configuraciones de WhatsApp')
        const data = await res.json()
        setConfigs(data)
      } catch (err) {
        console.error('Error cargando configuraciones:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfigs()
  }, [businessId])

  const handleSubmit = async () => {
    if (!name || !webhookURL || !whatsappConfigId) {
      toast.warning('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      const res = await fetch(`/api/business/bot/bot_business/${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          webhookURL,
          webhookTestURL,
          whatsappConfigId,
        }),
      })

      if (res.ok) {
        toast.success('Bot creado con éxito')
        onCreated()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al crear bot')
      }
    } catch (err) {
      console.error('Error al crear el bot', err)
      toast.error('Error del servidor')
    }
  }

  if (loading) return <p className="text-gray-500">Cargando configuraciones...</p>

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Crear nuevo Bot</h2>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Bot</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ej: Bot de bienvenida"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Descripción opcional del bot"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="https://..."
            value={webhookURL}
            onChange={(e) => setWebhookURL(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Webhook de prueba (opcional)</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            placeholder="https://..."
            value={webhookTestURL}
            onChange={(e) => setWebhookTestURL(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Configuración de WhatsApp</label>
          <select
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={whatsappConfigId}
            onChange={(e) => setWhatsappConfigId(e.target.value)}
          >
            <option value="">Selecciona una configuración</option>
            {configs.map((cfg) => (
              <option key={cfg.id} value={cfg.id}>
                {cfg.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-semibold rounded text-white bg-orange-500 hover:bg-orange-600 transition"
        >
          Crear Bot
        </button>
      </div>
    </div>
  )
}
