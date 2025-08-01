'use client'

import { useState } from 'react'

interface Props {
  onSubmit: (username: string, role: string) => Promise<void>
  loading: boolean
}

const roles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES_AGENT', 'VIEWER']

export default function ApiLeadUserForm({ onSubmit, loading }: Props) {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(username, role)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ej: juan.perez"
          className="mt-1 w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          required
        >
          <option value="" disabled>Selecciona un rol</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrar usuario'}
      </button>
    </form>
  )
}
