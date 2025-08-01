'use client'

import { useEffect, useState } from 'react'
import { Environment, WhatsappConfig } from '../../types/types'

export default function WhatsappConfigForm({ botId }: { botId: string }) {
  const [config, setConfig] = useState<WhatsappConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBotWithConfig = async () => {
      try {
        const res = await fetch(`/api/business/bot/id/${botId}`)
        if (!res.ok) throw new Error('No se pudo cargar el bot')
        const data = await res.json()

        if (!data.whatsappConfig) throw new Error('El bot no tiene configuración de WhatsApp')
        setConfig(data.whatsappConfig)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBotWithConfig()
  }, [botId])

  const handleChange = (field: keyof WhatsappConfig, value: string) => {
    setConfig((prev) =>
      prev ? { ...prev, [field]: value } : prev
    )
  }

  const handleSave = async () => {
    if (!config) return
    setSaving(true)

    try {
      const res = await fetch(`/api/business/whatsapp/config/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: config.accessToken,
          environment: config.environment,
          testDestinationNumber: config.environment === 'PROD' ? null : config.testDestinationNumber,
        }),
      })

      if (!res.ok) throw new Error('Error al actualizar configuración')

      const updated = await res.json()
      setConfig(updated)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-gray-600">Cargando configuración...</p>
  if (!config) return <p className="text-sm text-red-600">No se encontró configuración</p>

  return (
    <div className="space-y-5 text-left">
      <InfoField label="Nombre" value={config.name} />
      <InfoField label="WABA ID" value={config.wabaId} />
      <InfoField label="Phone Number ID" value={config.phoneNumberId} />
      <InfoField label="Número del remitente" value={config.senderPhoneNumber} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
        <input
          type="text"
          value={config.accessToken}
          onChange={(e) => handleChange('accessToken', e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Entorno</label>
        <select
          value={config.environment}
          onChange={(e) => handleChange('environment', e.target.value as Environment)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm text-gray-700"
        >
          <option value="DEV">DEV</option>
          <option value="TEST">TEST</option>
          <option value="PROD">PROD</option>
        </select>
      </div>

      {config.environment !== 'PROD' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de prueba</label>
          <input
            type="text"
            value={config.testDestinationNumber || ''}
            onChange={(e) => handleChange('testDestinationNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm text-gray-700"
          />
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-xl shadow transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Actualizar configuración'}
        </button>
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-orange-600 font-semibold text-sm bg-orange-50 rounded-xl px-4 py-2 border border-orange-200 shadow-sm">
        {value}
      </p>
    </div>
  )
}
