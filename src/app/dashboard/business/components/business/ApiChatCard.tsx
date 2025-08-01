'use client'

import { BotMessageSquare, Settings2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export type Props = {
  integration: {
    id: string
    publicApiKey: string
    status: string
    bot: boolean
  }
}

export default function ApiChatCard({ integration }: Props) {
  const router = useRouter()
  const { id: businessApiId, publicApiKey, status, bot } = integration

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm space-y-4">
      <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50">
        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/dashboard/api_chat/${businessApiId}`)}
            className="flex items-center gap-1 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-full px-4 py-2 shadow transition"
          >
            <Settings2 className="w-4 h-4" />
            Configurar
          </button>
        </div>

        <div className="flex items-start gap-4">
          <BotMessageSquare className="text-gray-500 w-10 h-10 mt-1" />
          <div className="text-left space-y-2">
            <h2 className="text-gray-800 text-lg font-bold">API CHATS</h2>

            <p className="text-gray-700 text-sm">
              Esta es la API principal encargada de la memoria conversacional del bot y de automatizar los mensajes con los usuarios.
            </p>

            <div>
              <label className="block text-xs text-gray-500 mb-1">API Key Pública:</label>
              <input
                readOnly
                value={publicApiKey}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white"
              />
            </div>

            <p className="text-sm text-gray-600">
              Estado de la integración:{' '}
              <strong className="text-gray-800">{status}</strong>
            </p>

            {!bot ? (
              <p className="text-sm text-orange-600 font-semibold">
                ⚠️ No tienes un bot configurado. Por favor configúralo desde el menú &quot;Bot&quot;.
              </p>
            ) : (
              <p className="text-sm text-green-600 font-semibold">
                ✅ Hay un bot configurado para esta API.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
