'use client'

import { useEffect, useState } from 'react'
import { Bot, UserCog, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Props, SubApi } from '../../types/types'

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'DISABLED']

export default function BusinessSubApiConfigList({ businessApiId }: Props) {
  const [subApis, setSubApis] = useState<SubApi[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingApiId, setSavingApiId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/business/api_integration/id/${businessApiId}`)
        const data = await res.json()
        setSubApis(data.subApis || [])
      } catch (error) {
        console.error('Error loading sub APIs', error)
        toast.error('Error cargando las sub APIs')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [businessApiId])

  const handleStatusChange = (apiId: string, newStatus: string) => {
    setSubApis((prev) =>
      prev?.map((s) => (s.apiId === apiId ? { ...s, status: newStatus as SubApi['status'] } : s)) || null
    )
  }

  const handleSave = async (apiId: string) => {
    const updated = subApis?.find((s) => s.apiId === apiId)
    if (!updated) return

    setSavingApiId(apiId)
    try {
      const res = await fetch(`/api/business/api_integration/sub_api/id/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updated.status }),
      })

      if (!res.ok) {
        throw new Error('Error actualizando la sub API')
      }

      toast.success('Sub API actualizada correctamente')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar la sub API')
    } finally {
      setSavingApiId(null)
    }
  }

  const handleManualActivation = () => {
    console.log('🔥 Activar manualmente API lead')
    toast('Función de activación manual aún no implementada')
  }

  if (loading) return <p className="text-gray-600 text-sm">Cargando configuración...</p>

  return (
    <div className="mt-6 space-y-4">
      {subApis?.length === 0 ? (
        <div className="p-6 bg-white border rounded-xl shadow text-center">
          <p className="text-gray-700 mb-4">No hay sub APIs activas aún.</p>
          <button
            onClick={handleManualActivation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"
          >
            <Bot size={18} /> Activar API Lead
          </button>
        </div>
      ) : (
        (subApis ?? []).map((subApi) => {
          const isLead = subApi.api.name === 'leads_api'
          return (
            <div
              key={subApi.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 font-semibold text-base">
                    {subApi.api.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    ID: {subApi.apiId} | Entorno: {subApi.api.type}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={subApi.status}
                    onChange={(e) => handleStatusChange(subApi.apiId, e.target.value)}
                    className="px-3 py-1 rounded border text-sm text-gray-800 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSave(subApi.apiId)}
                    disabled={savingApiId === subApi.apiId}
                    className={`px-4 py-1.5 text-sm font-medium rounded text-white transition ${
                      savingApiId === subApi.apiId
                        ? 'bg-orange-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {savingApiId === subApi.apiId ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>

              {isLead && (
                <div className="border border-orange-200 rounded-lg p-3 mt-2 space-y-3 text-center">
                  <p className="text-sm text-orange-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
                    <AlertTriangle size={16} className="text-orange-500" />
                    <span>
                      Esta es la <strong>API principal de Leads</strong> del negocio. Es necesario
                      registrar al menos <strong>un usuario super admin</strong> para gestionar bots,
                      leads, reportes y más funciones avanzadas.
                    </span>
                  </p>
                  <Link
                    href={`/dashboard/api_lead/users/id/${subApi.id}`}
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
                  >
                    <UserCog size={18} /> Administrar usuarios de esta API
                  </Link>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
