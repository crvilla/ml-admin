import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import {
  Home,
  Building2,
  User,
  BrainCog,
  LogOut
} from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const getPayloadFromToken = async () => {
  const cookieStore = await cookies()
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 text-black flex flex-col justify-between py-6 px-4">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-orange-500">MAILO Admin</h2>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <Home className="w-5 h-5 text-orange-500" />
              Inicio
            </Link>
            <Link href="/dashboard/business" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <Building2 className="w-5 h-5 text-orange-500" />
              Negocios
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <User className="w-5 h-5 text-orange-500" />
              Perfil
            </Link>
            <Link href="/dashboard/ai-settings" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <BrainCog className="w-5 h-5 text-orange-500" />
              AI Settings
            </Link>
          </nav>
        </div>

        {/* Cerrar sesión */}
        <form action="/api/auth/logout" method="POST" className="mt-8">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <Toaster />
        {children}
      </main>
    </div>
  )
}
