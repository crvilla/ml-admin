'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al cambiar la contraseña')
    } else {
      setSuccess('Contraseña actualizada correctamente')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Actualizar
        </button>
      </form>
    </div>
  )
}
