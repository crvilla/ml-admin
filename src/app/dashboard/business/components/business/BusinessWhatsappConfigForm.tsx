'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  businessId: string
  onCreated?: () => void
  onCancel?: () => void
}

export default function BusinessWhatsappConfigForm({ businessId, onCreated, onCancel }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [wabaId, setWabaId] = useState('')
  const [phoneNumberId, setPhoneNumberId] = useState('')
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [environment, setEnvironment] = useState('DEV')
  const [testDestinationNumber, setTestDestinationNumber] = useState('')

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/whatsapp/config/${businessId}`)
        if (res.ok) {
          const data = await res.json()
          setName(data.name || '')
          setWabaId(data.wabaId)
          setPhoneNumberId(data.phoneNumberId)
          setSenderPhoneNumber(data.senderPhoneNumber)
          setAccessToken(data.accessToken)
          setEnvironment(data.environment)
          setTestDestinationNumber(data.testDestinationNumber || '')
        }
      } catch (err) {
        console.error('No WhatsApp config found, starting fresh.', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [businessId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/whatsapp/config/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          wabaId,
          phoneNumberId,
          senderPhoneNumber,
          accessToken,
          environment,
          testDestinationNumber,
        }),
      })

      if (res.ok) {
        toast.success('Configuración de WhatsApp guardada')
        onCreated?.()
      } else {
        toast.error('Error al guardar la configuración')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error del servidor')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500">Cargando configuración de WhatsApp...</p>

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Configuración para envío de mensajes</h2>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de esta configuración</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            placeholder="Ej: WhatsApp Principal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">WABA ID</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            placeholder="WABA ID"
            value={wabaId}
            onChange={(e) => setWabaId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number ID</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            placeholder="Phone Number ID"
            value={phoneNumberId}
            onChange={(e) => setPhoneNumberId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Número remitente</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            placeholder="Ej: 15551901575"
            value={senderPhoneNumber}
            onChange={(e) => setSenderPhoneNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Access Token</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            placeholder="Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </div>

        {(environment === 'DEV' || environment === 'TEST') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de destino para pruebas</label>
            <input
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              placeholder="Ej: 573001112233"
              value={testDestinationNumber}
              onChange={(e) => setTestDestinationNumber(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Ambiente</label>
          <select
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="DEV">DEV</option>
            <option value="TEST">TEST</option>
            <option value="PROD">PROD</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full mt-4 px-4 py-2 text-sm font-semibold rounded text-white transition ${
          saving ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        Guardar configuración
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-2 px-4 py-2 text-sm font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
      )}
    </div>
  )
}
