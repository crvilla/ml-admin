'use client'

import { useEffect, useState } from 'react'

type Environment = 'DEV' | 'TEST' | 'PROD'

type WhatsappConfig = {
  id: string
  name: string
  wabaId: string
  phoneNumberId: string
  senderPhoneNumber: string
  accessToken: string
  environment: Environment
  testDestinationNumber: string | null
}

export default function WhatsappConfigForm({ botId }: { botId: string }) {
  const [config, setConfig] = useState<WhatsappConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBotWithConfig = async () => {
      try {
        const res = await fetch(`/api/bot/${botId}`)
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
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Entorno</label>
        <input
          type="text"
          value={config.environment}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm text-gray-700"
        />
      </div>

      {config.environment !== 'PROD' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de prueba</label>
          <input
            type="text"
            value={config.testDestinationNumber || ''}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm text-gray-700"
          />
        </div>
      )}
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
