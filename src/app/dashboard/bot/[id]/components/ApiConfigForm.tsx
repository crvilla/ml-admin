'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ApiIntegration } from '../../types/types'

interface Props {
  botId: string
}

export default function ApiConfigForm({ botId }: Props) {
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState<ApiIntegration[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/business/bot/id/${botId}`)
        if (!res.ok) throw new Error('No se pudo cargar el bot')
        const data = await res.json()
        setApiData(data.apiIntegrations || [])
      } catch (err) {
        console.error('Error al cargar integraciones API', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [botId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    )
  }

  if (!apiData.length) {
    return <p className="text-sm text-gray-500">No hay integraciones configuradas.</p>
  }

  return (
    <div className="space-y-6 text-left">
      {apiData.map((api) => (
        <div key={api.id} className="space-y-4 border border-gray-200 p-4 rounded-xl shadow-sm bg-white">
          <InfoField label="Nombre" value={api.api.name} />
          <InfoField label="Tipo" value={api.api.type} />
          <InfoField label="Clave pública" value={api.publicApiKey} />
          <InfoField label="Estado" value={api.status} />

          {api.subApis?.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-orange-500 mb-2">SubAPIs</label>
              <div className="space-y-2 pl-2 border-l-2 border-orange-300">
                {api.subApis.map((sub, index) => (
                  <div key={index} className="ml-2">
                    <p className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-2 rounded-md border border-orange-200 shadow-sm">
                      {sub.api.name} ({sub.api.type}) — <span className="italic text-gray-700">{sub.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="w-full bg-orange-50 text-orange-600 font-semibold text-sm rounded-xl px-4 py-2 border border-orange-200 shadow-sm"
      />
    </div>
  )
}
