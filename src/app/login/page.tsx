'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [user_name, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al iniciar sesión')
      return
    }

    // No necesitas guardar el token (está en cookie HttpOnly)
    router.push('/dashboard')
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={user_name}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  )
}
