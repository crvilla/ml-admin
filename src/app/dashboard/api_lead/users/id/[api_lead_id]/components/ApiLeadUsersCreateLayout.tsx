'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import ApiLeadUserForm from './ApiLeadUserForm'
import ApiLeadUserSuccess from './ApiLeadUserSuccess'
import toast from 'react-hot-toast'

export default function ApiLeadUsersCreateLayout() {
  const params = useParams()
  const apiLeadId = params?.api_lead_id as string

  const [loading, setLoading] = useState(false)
  const [createdUser, setCreatedUser] = useState<{ username: string; password: string } | null>(null)

  const handleSubmit = async (username: string, role: string) => {
    setLoading(true)
    setCreatedUser(null)

    try {
      const res = await fetch(`/api/business/api_integration/sub_api/users/api_lead_id/${apiLeadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error || 'Error al crear el usuario')
        console.error('❌ Error creando usuario:', data)
      } else {
        toast.success('Usuario creado exitosamente')
        setCreatedUser({ username, password: data.password })
        console.log('✅ Usuario creado:', data)
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err)
      toast.error('Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => setCreatedUser(null)

  const usersPath = `/dashboard/api_lead/users/id/${apiLeadId}`

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md space-y-6 border border-orange-200 rounded-2xl p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-orange-600">
          Registrar nuevo usuario
        </h2>

        {createdUser ? (
          <ApiLeadUserSuccess
            username={createdUser.username}
            password={createdUser.password}
            onRegisterNew={resetForm}
            usersPath={usersPath}
          />
        ) : (
          <ApiLeadUserForm onSubmit={handleSubmit} loading={loading} />
        )}

        {!createdUser && (
          <div className="text-center mt-4">
            <Link
              href={usersPath}
              className="text-sm text-orange-600 hover:underline"
            >
              ← Volver al listado de usuarios
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
