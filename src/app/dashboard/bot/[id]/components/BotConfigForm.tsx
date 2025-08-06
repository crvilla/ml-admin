'use client'

import { useEffect, useState } from 'react'
import { Bot, WhatsappConfig } from '../../types/types'

function generateToken(length = 24) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function BotConfigForm({ botId }: { botId: string }) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [webhookURL, setWebhookURL] = useState('')
  const [webhookTestURL, setWebhookTestURL] = useState('')
  const [whatsappConfigId, setWhatsappConfigId] = useState('')
  const [whatsappWebhookToken, setWhatsappWebhookToken] = useState('')
  const [whatsappWebhookPath, setWhatsappWebhookPath] = useState('')
  const [wsConfigs, setWsConfigs] = useState<WhatsappConfig[]>([])
  const [simulatedPhone, setSimulatedPhone] = useState('')


  useEffect(() => {
    const fetchBot = async () => {
      try {
        const res = await fetch(`/api/business/bot/id/${botId}`)
        if (!res.ok) throw new Error('Error al cargar bot')
        const data = await res.json()
        setBot(data)
        setSimulatedPhone(data.simulatedPhone || '')
        setName(data.name)
        setDescription(data.description || '')
        setWebhookURL(data.webhookURL)
        setWebhookTestURL(data.webhookTestURL || '')
        setWhatsappWebhookToken(data.whatsappWebhookToken || '')
        setWhatsappWebhookPath(data.whatsappWebhookPath || `/api/business/bot/webhook/bot_id/${botId}`)
        setWhatsappConfigId(data.whatsappConfig.id)

        const wsRes = await fetch(`/api/business/whatsapp/business/${data.businessId}`)
        if (!wsRes.ok) throw new Error('Error al cargar configuraciones de WhatsApp')
        setWsConfigs(await wsRes.json())
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
          whatsappWebhookToken,
          whatsappWebhookPath,
          simulatedPhone
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

  const handleGenerateToken = () => {
    const token = generateToken()
    setWhatsappWebhookToken(token)
  }

  if (loading) return <p className="text-sm text-gray-600">Cargando bot...</p>
  if (!bot) return <p className="text-sm text-red-600">Bot no encontrado</p>

  return (
    <div className="space-y-5">
      {/* Campos principales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número simulado</label>
        <input
          type="text"
          value={simulatedPhone}
          onChange={(e) => setSimulatedPhone(e.target.value)}
          placeholder="+573001234567"
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
        <input type="text" value={webhookURL} onChange={(e) => setWebhookURL(e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook de prueba (opcional)</label>
        <input type="text" value={webhookTestURL} onChange={(e) => setWebhookTestURL(e.target.value)} className="w-full border border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-2 text-sm shadow-sm transition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Configuración de WhatsApp</label>
        <select value={whatsappConfigId} onChange={(e) => setWhatsappConfigId(e.target.value)} className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm shadow-sm transition">
          {wsConfigs.map((config) => (
            <option key={config.id} value={config.id}>{config.name}</option>
          ))}
        </select>
      </div>

      {/* 🔸 Bloque WhatsApp Webhook Config */}
      <fieldset className="border border-orange-400 rounded-xl p-4 space-y-4">
        <legend className="text-sm font-medium text-orange-600">Webhook de WhatsApp</legend>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Path del Webhook</label>
          <input
            type="text"
            value={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${whatsappWebhookPath}`}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Token de verificación</label>
          <div className="flex gap-2 items-center">
            <input type="text" value={whatsappWebhookToken} disabled className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm" />
            <button
              type="button"
              onClick={handleGenerateToken}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
            >
              Generar token
            </button>
          </div>
        </div>
      </fieldset>

      {/* 🔘 Botón Final */}
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
