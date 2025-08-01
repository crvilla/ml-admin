'use client'

import Link from 'next/link'
import { CheckCircle, User, KeyRound, ArrowLeftCircle, PlusCircle } from 'lucide-react'

interface Props {
  username: string
  password: string
  onRegisterNew: () => void
  usersPath: string
}

export default function ApiLeadUserSuccess({ username, password, onRegisterNew, usersPath }: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="w-10 h-10 text-orange-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Usuario registrado exitosamente
      </h2>

      <div className="text-sm text-gray-700 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span><strong>Usuario:</strong> {username}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <KeyRound className="w-4 h-4 text-gray-500" />
          <span><strong>Contraseña:</strong> {password}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={onRegisterNew}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar nuevo usuario
        </button>

        <Link
          href={usersPath}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
        >
          <ArrowLeftCircle className="w-4 h-4" />
          Volver al listado de usuarios
        </Link>
      </div>
    </div>
  )
}
