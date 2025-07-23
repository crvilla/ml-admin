'use client'

import { Button } from '@heroui/react'
import { BotMessageSquare } from 'lucide-react'

type Props = {
  businessId: string
  environment: 'DEV' | 'PROD'
}

export default function BusinessApiEnvTab({ businessId, environment }: Props) {
  const handleActivate = () => {
    // Aquí puedes manejar la lógica para activar la API
    console.log('Activar API para', businessId, environment)
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border border-dashed border-orange-400 rounded-2xl p-6 bg-orange-50">
        <div className="flex items-center gap-4">
          <BotMessageSquare className="text-orange-500 w-10 h-10" />
          <p className="text-gray-800 text-sm max-w-md">
            Aún no tienes una API de chats configurada para el entorno <strong>{environment}</strong>. Para que tu bot pueda conversar con tus usuarios, necesitas activarla primero.
          </p>
        </div>

        <Button
          onClick={handleActivate}
          className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-full text-sm font-semibold shadow"
        >
          Activar API ahora
        </Button>
      </div>
    </div>
  )
}
