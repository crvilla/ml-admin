'use client'

import { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import { BotMessageSquare } from 'lucide-react'
import ApiChatCard from './ApiChatCard'
import toast from 'react-hot-toast'

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
        // Activar Leads API primero
        const integrationId = registerData.id
        const leadsRes = await fetch(`/api/business/api_integration/sub_api/api_integration_id/${integrationId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            env: environment,
            apiName: 'leads_api',
          }),
        })

        const leadsData = await leadsRes.json()

        if (!leadsRes.ok) {
          console.error('Error activando Leads API:', leadsData)
        } else {
          console.log('Leads API activada correctamente:', leadsData)
        }

        toast.success('Integración activada correctamente')
        setExists(true)
        setIntegration(registerData)
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
    return <ApiChatCard integration={integration} />
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
