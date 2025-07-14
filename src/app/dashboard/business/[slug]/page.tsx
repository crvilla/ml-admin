'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Input } from '@heroui/react'
import { Button } from '@heroui/react'
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

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/business/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookToken: token }),
      })

      if (res.ok) {
        toast.success('Token actualizado correctamente')
      } else {
        toast.error('Error al actualizar el token')
      }
    } catch (err) {
      toast.error('Error del servidor')
    }
  }

  if (loading) return <p className="p-6 text-gray-600">Cargando...</p>
  if (!business) return <p className="p-6 text-red-600">Cliente no encontrado</p>

  const webhookURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/${business.slug}`

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Configuración de WhatsApp para {business.name}</h1>

      <div>
        <label className="text-gray-700 font-medium">Webhook URL</label>
        <div className="bg-gray-100 p-3 rounded mt-1 text-sm text-gray-700 break-all">
          {webhookURL}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-gray-700 font-medium" htmlFor="token">
          Token de verificación
        </label>
        <Input
          id="token"
          placeholder="Ingrese el token que usará WhatsApp"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <Button
        color="warning"
        className="mt-4"
        onClick={handleSave}
        disabled={!token}
      >
        Guardar configuración
      </Button>
    </div>
  )
}
