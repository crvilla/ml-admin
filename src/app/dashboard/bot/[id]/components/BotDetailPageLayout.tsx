'use client'

import { useParams } from 'next/navigation'
import { Accordion, AccordionItem } from '@heroui/react'
import { Bot, MessageCircle, PlugZap } from 'lucide-react'
import BotConfigForm from './BotConfigForm'
import WhatsappConfigForm from './WhatsappConfigForm'

export default function BotDetailPageLayout() {
  const params = useParams()
  const botId = params?.id as string

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
      {/* Lado izquierdo: Chat */}
      <div className="w-1/2 border-r border-gray-200 px-4 py-3 flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-orange-600">AQUÍ EL CHAT</h1>
      </div>

      {/* Lado derecho: Configuración */}
      <div className="w-1/2 px-4 py-3 overflow-y-auto">
        <Accordion
          variant="splitted"
          className="space-y-2"
          itemClasses={{
            base: 'bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:border-orange-300 hover:shadow-md',
            title: 'text-md font-semibold text-gray-800 hover:text-orange-600',
            trigger: 'px-3 py-2',
            content: 'px-3 pb-3 pt-2',
          }}
        >
          <AccordionItem
            key="bot"
            aria-label="Bot"
            title={
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-orange-500" />
                <span>Bot</span>
              </div>
            }
          >
            <BotConfigForm botId={botId} />
          </AccordionItem>

          <AccordionItem
            key="ws"
            aria-label="WhatsApp"
            title={
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-orange-500" />
                <span>WhatsApp</span>
              </div>
            }
          >
            <WhatsappConfigForm botId={botId} />
          </AccordionItem>

          <AccordionItem
            key="api"
            aria-label="API"
            title={
              <div className="flex items-center gap-2">
                <PlugZap size={18} className="text-orange-500" />
                <span>API Integrations</span>
              </div>
            }
          >
            <div className="text-center">
              <h1 className="text-sm font-medium text-gray-700">CONFIG API</h1>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
