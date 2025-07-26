'use client'

import { useState } from 'react'

type Props = {
  businessApiId: string
}

const CATALOG_SUBAPIS = [
  {
    id: 'lead-dev',
    name: 'Leads DEV',
  },
  {
    id: 'lead-prod',
    name: 'Leads PROD',
  },
]

const INITIAL_ACTIVATED = [
  {
    apiId: 'lead-dev',
    status: 'ACTIVE',
  },
]

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'DISABLED']

export default function BusinessSubApiConfigList({ businessApiId }: Props) {
  const [subApis, setSubApis] = useState(INITIAL_ACTIVATED)
  const [savingApiId, setSavingApiId] = useState<string | null>(null)

  const isActivated = (apiId: string) => subApis.some((s) => s.apiId === apiId)
  const getStatus = (apiId: string) => subApis.find((s) => s.apiId === apiId)?.status || 'INACTIVE'

  const handleStatusChange = (apiId: string, newStatus: string) => {
    setSubApis((prev) =>
      prev.map((s) => (s.apiId === apiId ? { ...s, status: newStatus } : s))
    )
  }

  const handleSave = (apiId: string) => {
    setSavingApiId(apiId)
    setTimeout(() => {
      console.log(`💾 Guardado status para ${apiId}:`, getStatus(apiId))
      setSavingApiId(null)
    }, 800)
  }

  const handleActivate = (apiId: string) => {
    setSubApis((prev) => [...prev, { apiId, status: 'ACTIVE' }])
  }

  return (
    <div className="space-y-4 mt-4">
      {CATALOG_SUBAPIS.map((catalogApi) => {
        const activated = isActivated(catalogApi.id)

        return (
          <div
            key={catalogApi.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-medium">{catalogApi.name}</p>
                <p className="text-sm text-gray-500">ID: {catalogApi.id}</p>
              </div>

              {activated ? (
                <div className="flex items-center gap-2">
                  <select
                    value={getStatus(catalogApi.id)}
                    onChange={(e) => handleStatusChange(catalogApi.id, e.target.value)}
                    className="px-3 py-1 rounded border text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSave(catalogApi.id)}
                    disabled={savingApiId === catalogApi.id}
                    className={`px-4 py-1.5 text-sm font-medium rounded text-white transition ${
                      savingApiId === catalogApi.id
                        ? 'bg-orange-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {savingApiId === catalogApi.id ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleActivate(catalogApi.id)}
                  className="px-4 py-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded transition"
                >
                  Activar
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
