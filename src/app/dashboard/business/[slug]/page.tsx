'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

type Business = {
  id: string
  name: string
  slug: string
  status: string
  webhookToken: string | null
}

export default function BusinessDetailPage() {
  const { slug } = useParams()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`/api/business/${slug}`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Error al cargar cliente')
        }

        const data = await res.json()
        setBusiness(data)
        setToken(data.webhookToken || '')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [slug])

  const handleSave = async (newToken?: string) => {
    const updatedToken = newToken ?? token
    setSaving(true)

    try {
      const res = await fetch(`/api/business/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookToken: updatedToken }),
      })

      if (res.ok) {
        toast.success('Token actualizado correctamente')
        setToken(updatedToken)
      } else {
        toast.error('Error al actualizar el token')
      }
    } catch (err) {
      toast.error('Error del servidor')
    } finally {
      setSaving(false)
    }
  }

  const generateToken = () => {
    const newToken = crypto.randomUUID()
    handleSave(newToken)
  }

  if (loading) return <p className="p-6 text-gray-600">Cargando...</p>
  if (!business) return <p className="p-6 text-red-600">Cliente no encontrado</p>

  const webhookURL = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/${business.slug}`

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">
          Configuración de WhatsApp para <span className="text-orange-500">{business.name}</span>
        </h1>

        <div>
          <label className="text-gray-700 font-medium">Webhook URL</label>
          <div className="bg-gray-100 p-3 rounded mt-1 text-sm text-gray-700 break-all border border-gray-300">
            {webhookURL}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium" htmlFor="token">
            Token de verificación
          </label>
          <div className="flex gap-2">
            <input
              id="token"
              placeholder="Ingrese el token que usará WhatsApp"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1 px-3 py-2 rounded border text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
            <button
              type="button"
              onClick={generateToken}
              className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded transition"
            >
              Generar token
            </button>
          </div>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={!token || saving}
          className={`w-full mt-4 px-4 py-2 text-sm font-semibold rounded text-white transition ${
            saving || !token
              ? 'bg-orange-300 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          Guardar configuración
        </button>
      </div>
    </div>
  )
}
