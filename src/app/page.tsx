'use client'

import { Button } from '@heroui/react'
import { ShieldCheck, Mail } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 sm:px-10 text-gray-800">
      {/* Imagen central estilo Lukran */}
      <div className="mb-8">
        <Image
          src="https://mailotechnologies.com/wp-content/uploads/2023/09/PostivoPNG.png"
          alt="Logo Mailo"
          width={300}
          height={100}
          priority
        />
      </div>

      {/* Título principal */}
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4 text-center">
        Bienvenido a MAILO ADMIN
      </h1>

      {/* Descripción */}
      <p className="text-center text-base sm:text-lg max-w-2xl text-gray-600 mb-10">
        Donde la atención al cliente se transforma con inteligencia artificial. Automatiza lo que antes tomaba horas y enfócate en lo que realmente importa: hacer crecer tu negocio.
      </p>

      {/* Íconos informativos */}
      <div className="flex flex-col sm:flex-row gap-6 mb-12 text-sm text-gray-700 text-center">
        <div className="flex items-center gap-2 justify-center">
          <ShieldCheck className="text-orange-500" size={20} />
          Seguridad de acceso y control de roles
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Mail className="text-orange-500" size={20} />
          Integración con APIs y AI
        </div>
      </div>

      {/* Botón principal Lukran style */}
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-full shadow-md transition hover:shadow-lg"
        onClick={() => router.push('/login')}
      >
        Iniciar sesión
      </Button>

      {/* Sección "Acerca" */}
      <div id="acerca" className="mt-24 max-w-2xl text-center">
        <h2 className="text-xl font-semibold text-orange-600 mb-2">Plataforma administrativa</h2>
        <p className="text-gray-600">
          Automatiza la atención, gestión de clientes y procesos de venta con el poder de la inteligencia artificial. Conecta servicios como WhatsApp Business y deja que la IA trabaje por ti.
        </p>
      </div>

      {/* Sección "Contacto" */}
      <div id="contacto" className="mt-16 max-w-2xl text-center mb-24">
        <h2 className="text-xl font-semibold text-orange-600 mb-2">Contacto</h2>
        <p className="text-gray-600">Para más información, contáctanos.</p>
      </div>
    </main>
  )
}
