'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import { PlusCircle } from 'lucide-react'
import BotCreateForm from './BotCreateForm'

type BotBusiness = {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export default function BotBusiness({ businessId }: { businessId: string }) {
  const [bots, setBots] = useState<BotBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const fetchBots = async () => {
    try {
      const res = await fetch(`/api/bot_business/${businessId}`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setBots(data)
    } catch (err) {
      console.error('Error al cargar bots', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!businessId) return
    fetchBots()
  }, [businessId])

  if (loading) return <p className="text-gray-600">Cargando bots...</p>

  if (isCreating) {
    return (
      <BotCreateForm
        businessId={businessId}
        onCreated={() => {
          setIsCreating(false)
          fetchBots()
        }}
        onCancel={() => setIsCreating(false)}
      />
    )
  }

  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500 mb-4">No hay bots configurados aún.</p>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition"
        >
          <PlusCircle size={18} />
          Crear un Bot
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bots.map((bot) => (
        <Card key={bot.id} className="relative">
          <CardHeader>
            <h3 className="text-lg font-semibold text-orange-600">{bot.name}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600">{bot.description || 'Sin descripción.'}</p>
            <p className="text-xs text-gray-400 mt-2">
              Creado: {new Date(bot.createdAt).toLocaleString()}
            </p>
          </CardBody>
        </Card>
      ))}

      {/* Card para crear nuevo bot */}
      <Card className="cursor-pointer border-2 border-dashed border-orange-500 hover:bg-orange-50 transition">
        <div
          onClick={() => setIsCreating(true)}
          role="button"
          tabIndex={0}
          className="w-full h-full flex flex-col items-center justify-center text-orange-600 py-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <PlusCircle size={32} className="mb-2" />
          <h3 className="text-md font-semibold">Crear nuevo bot</h3>
        </div>
      </Card>
    </div>
  )
}
