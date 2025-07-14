import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import React from 'react'

const getPayloadFromToken = async () => {
  const cookieStore = await cookies() // 👈 AQUÍ el cambio
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/login')

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error('Token inválido en layout:', error)
    redirect('/login')
  }
}

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  await getPayloadFromToken()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Panel de administración</h1>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <main>{children}</main>
    </div>
  )
}
