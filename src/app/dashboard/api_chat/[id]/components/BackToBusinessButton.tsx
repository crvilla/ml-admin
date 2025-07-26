'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackToBusinessButton({ businessApiId }: { businessApiId: string }) {
  const [slug, setSlug] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSlug = async () => {
      try {
        const res = await fetch(`/api/business/api_integration/id/${businessApiId}`)
        if (!res.ok) throw new Error('Fallo en la respuesta del servidor')
        const data = await res.json()
        setSlug(data.business.slug)
      } catch (err) {
        console.error('Error al obtener el slug del negocio', err)
      }
    }

    fetchSlug()
  }, [businessApiId])

  if (!slug) return null

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => router.push(`/dashboard/business/${slug}`)}
        className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-800 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Negocios
      </button>
    </div>
  )
}
