'use client'

import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  slug: string
  initialName: string
  initialStatus: string
  onUpdate: (updates: { name: string; status: string }) => void
}

export default function BusinessInfoForm({ slug, initialName, initialStatus, onUpdate }: Props) {
  const [name, setName] = useState(initialName)
  const [status, setStatus] = useState(initialStatus)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    try {
      const res = await fetch(`/api/business/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status }),
      })

      if (!res.ok) {
        toast.error('Error al actualizar el cliente')
        return
      }

      toast.success('Cliente actualizado correctamente')

      // Notificar al padre para actualizar el state global
      onUpdate({ name, status })
    } catch (err) {
      console.error(err)
      toast.error('Error del servidor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
        >
          <option value="PENDING">PENDING</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full mt-4 px-4 py-2 text-sm font-semibold rounded text-white transition ${
          saving ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        Guardar cambios
      </button>
    </div>
  )
}
