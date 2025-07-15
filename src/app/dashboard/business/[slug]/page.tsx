'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BusinessWebhookConfig from '../components/business/BusinessWebhookConfig'
import BusinessWhatsappConfigForm from '../components/business/BusinessWhatsappConfigForm'


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

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`/api/business/${slug}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Error al cargar cliente')
        }

        setBusiness(data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [slug])


  if (loading) return <p className="p-6 text-gray-600">Cargando...</p>
  if (!business) return <p className="p-6 text-red-600">Cliente no encontrado</p>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <BusinessWebhookConfig
        businessName={business.name}
        slug={business.slug}
        initialToken={business.webhookToken}
      />

      <BusinessWhatsappConfigForm businessId={business.id} />

    </div>
  )
}
