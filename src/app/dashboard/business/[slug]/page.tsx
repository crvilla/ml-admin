'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, Tab } from '@heroui/react'
import { Tabs as SubTabs, Tab as SubTab } from '@heroui/react'
import BusinessWebhookConfig from '../components/business/BusinessWebhookConfig'
import BusinessInfoForm from '../components/business/BusinessInfoForm'
import BotBusiness from '../components/business/BotBusiness'
import BusinessWhatsappConfigs from '../components/business/BusinessWhatsappConfigs'
import BusinessApiEnvTab from '../components/business/BusinessApiEnvTab'

type Business = {
  id: string
  name: string
  slug: string
  status: string
  webhookToken: string | null
}

export default function BusinessDetailPage() {
  const { slug } = useParams()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`/api/business/${slug}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Error al cargar cliente')
        }

        setBusiness(data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [slug])

  if (loading) return <p className="p-6 text-gray-600">Cargando...</p>
  if (!business) return <p className="p-6 text-red-600">Cliente no encontrado</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">
        Cliente: {business.name}
      </h1>

      <Tabs
        fullWidth
        aria-label="Detalles del cliente"
        variant="underlined"
        classNames={{
          tabList: 'gap-6 border-b border-gray-200',
          tab: 'text-sm font-medium',
          tabContent: 'group-data-[selected=true]:text-orange-600 group-data-[selected=true]:border-orange-500',
          panel: 'mt-6',
        }}
        color="warning"
      >
        <Tab key="info" title="Información">
          <BusinessInfoForm
            slug={business.slug}
            initialName={business.name}
            initialStatus={business.status}
            onUpdate={(updates) => {
              setBusiness((prev) => prev ? { ...prev, ...updates } : prev)
            }}
          />
        </Tab>

        <Tab key="ws" title="Configuración WS">
          <div className="space-y-6">
            <BusinessWebhookConfig
              businessName={business.name}
              slug={business.slug}
              initialToken={business.webhookToken}
            />
            <BusinessWhatsappConfigs businessId={business.id} />
          </div>
        </Tab>

        <Tab key="apis" title="APIS">
          <div className="space-y-4">
            <SubTabs
              aria-label="Ambiente de API"
              variant="light"
              color="warning"
              classNames={{
                tabList: 'gap-4 border-b border-gray-200',
                tab: 'text-sm font-medium',
                tabContent: 'group-data-[selected=true]:text-orange-600 group-data-[selected=true]:border-orange-500',
                panel: 'mt-4',
              }}
            >
              <SubTab key="demo" title="DEMO">
                <BusinessApiEnvTab businessId={business.id} environment="DEV" />
              </SubTab>

              <SubTab key="prod" title="PRODUCCIÓN">
                <BusinessApiEnvTab businessId={business.id} environment="PROD" />
              </SubTab>
            </SubTabs>
          </div>
        </Tab>

        <Tab key="bots" title="Bots">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Bots configurados</h2>
            <BotBusiness businessId={business.id} />
          </div>
        </Tab>

      </Tabs>
    </div>
  )
}
