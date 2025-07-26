'use client'

import { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import { BotMessageSquare, Settings2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  businessId: string
  environment: 'DEV' | 'PROD'
}
interface Integration {
  id: string
  publicApiKey: string
  status: string
  bot: boolean
}

export default function BusinessApiEnvTab({ businessId, environment }: Props) {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [exists, setExists] = useState<boolean | null>(null)
  const [integration, setIntegration] = useState<Integration | null>(null)
  const router = useRouter();

  useEffect(() => {
    const checkIntegration = async () => {
      try {
        const res = await fetch(`/api/business/api_integration/chats/business_id/${businessId}?env=${environment}`)
        const data = await res.json()

        if (res.ok) {
          setExists(data.exists)
          if (data.exists) {
            setIntegration(data.integration)
          }
        } else {
          setExists(false)
        }
      } catch (err) {
        console.error('Error de red verificando integración:', err)
        setExists(false)
      } finally {
        setChecking(false)
      }
    }

    checkIntegration()
  }, [businessId, environment])

  const handleActivate = async () => {
    setLoading(true)

    try {
      const activationRes = await fetch(`/api/business/api_integration/chats/business_id/${businessId}?env=${environment}`, {
        method: 'POST',
      })

      const activationData = await activationRes.json()

      if (!activationRes.ok) {
        console.error('Error activando API externa:', activationData)
        return
      }

      const { businessId: externalId, token: publicApiKey, status } = activationData.data

      const registerRes = await fetch(`/api/business/api_integration/business_id/${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiName: 'chats_api',
          env: environment,
          externalId: externalId.toString(),
          publicApiKey,
          status,
        }),
      })

      const registerData = await registerRes.json()

      if (registerRes.ok) {
        setExists(true)
        setIntegration(registerData.integration)
      } else {
        console.error('Error registrando integración:', registerData)
      }

    } catch (error) {
      console.error('Error en el proceso:', error)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return <p className="text-sm text-gray-500">Verificando integración...</p>
  }

  if (exists && integration) {
    const {
      id: businessApiId,
      publicApiKey,
      status,
      bot,
    } = integration

    return (
      <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm space-y-4">
        <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50">
          {/* Botón de editar estilo Lukran */}
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
                Estado de la integración: <strong className="text-gray-800">{status}</strong>
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

  // Caso cuando no existe
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
          disabled={loading}
          className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-full text-sm font-semibold shadow"
        >
          {loading ? 'Activando...' : 'Activar API ahora'}
        </Button>
      </div>
    </div>
  )
}
