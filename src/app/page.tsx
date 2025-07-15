'use client'

import { Button } from '@heroui/react'
import { LogIn, ShieldCheck, Mail } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 sm:px-10 text-gray-800">
      {/* Logo */}
      <div className="mb-6">
        <Image src="/logo-mailo.svg" alt="Mailo Logo" width={160} height={40} priority />
      </div>

      {/* Título principal */}
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4 text-center">
        Bienvenido a MAILO ADMIN
      </h1>

      {/* Descripción */}
      <p className="text-center text-base sm:text-lg max-w-xl text-gray-600 mb-8">
        Bienvenido a MAILO ADMIN: donde la atención al cliente se transforma con inteligencia artificial. Automatiza lo que antes tomaba horas y enfócate en lo que realmente importa: hacer crecer tu negocio.
      </p>

      {/* Íconos informativos */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-orange-500" size={20} />
          Seguridad de acceso y control de roles
        </div>
        <div className="flex items-center gap-2">
          <Mail className="text-orange-500" size={20} />
          Integración con APIs y AI
        </div>
      </div>

      {/* Botón principal */}
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg rounded-full"
        onClick={() => router.push('/login')}
      >
        <LogIn className="mr-2" size={20} />
        Iniciar sesión
      </Button>

      {/* Secciones internas scroll */}
      <div id="acerca" className="mt-20 max-w-2xl text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Plataforma administrativa</h2>
        <p className="text-gray-600">
          Automatiza la atención, gestión de clientes y procesos de venta con el poder de la inteligencia artificial. Conecta servicios como WhatsApp Business y deja que la IA trabaje por ti.
        </p>
      </div>

      <div id="contacto" className="mt-16 max-w-2xl text-center mb-20">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Contacto</h2>
        <p className="text-gray-600">
          Para más información, contáctanos..
        </p>
      </div>
    </main>
  )
}
