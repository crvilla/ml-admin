'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import { PlusCircle } from 'lucide-react'
import BusinessWhatsappConfigForm from './BusinessWhatsappConfigForm'

type WhatsappConfig = {
  id: string
  name: string
  phone: string
  status: string
  createdAt: string
}

export default function BusinessWhatsappConfigs({ businessId }: { businessId: string }) {
  const [configs, setConfigs] = useState<WhatsappConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`/api/whatsapp/config/all/${businessId}`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setConfigs(data)
    } catch (err) {
      console.error('Error al cargar configuraciones de WhatsApp', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [businessId])

  if (loading) return <p className="text-gray-600">Cargando configuraciones de WhatsApp...</p>

  if (isCreating) {
    return (
      <BusinessWhatsappConfigForm
        businessId={businessId}
        onCreated={() => {
          setIsCreating(false)
          fetchConfigs()
        }}
        onCancel={() => setIsCreating(false)}
      />
    )
  }

  if (configs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500 mb-4">No hay configuraciones aún.</p>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition"
        >
          <PlusCircle size={18} />
          Crear configuración de WhatsApp
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {configs.map((config) => (
        <Card key={config.id} className="relative">
          <CardHeader>
            <h3 className="text-lg font-semibold text-orange-600">{config.name}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600">Teléfono: {config.phone}</p>
            <p className="text-sm text-gray-600">Estado: {config.status}</p>
            <p className="text-xs text-gray-400 mt-2">
              Creado: {new Date(config.createdAt).toLocaleString()}
            </p>
          </CardBody>
        </Card>
      ))}

      {/* Card para crear nueva configuración */}
      <Card className="cursor-pointer border-2 border-dashed border-orange-500 hover:bg-orange-50 transition">
        <div
          onClick={() => setIsCreating(true)}
          role="button"
          tabIndex={0}
          className="w-full h-full flex flex-col items-center justify-center text-orange-600 py-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <PlusCircle size={32} className="mb-2" />
          <h3 className="text-md font-semibold">Crear nueva configuración</h3>
        </div>
      </Card>
    </div>
  )
}
