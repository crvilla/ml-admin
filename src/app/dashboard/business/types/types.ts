
export type Business = {
  id: string
  name: string
  slug: string
  status: string
  webhookToken: string | null
}

export type BotBusiness = {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface Integration {
  id: string
  publicApiKey: string
  status: string
  bot: boolean
}


export type WhatsappConfig = {
  id: string
  name: string
  phone: string
  status: string
  createdAt: string
}

export interface Bot {
  id: string
  name: string
  description?: string
  webhookURL: string
  webhookTestURL?: string
  whatsappWebhookToken?: string
  whatsappWebhookPath?: string
  businessId: string
  whatsappConfigId: string
  whatsappConfig: {
    id: string
    name: string
  }
  apiIntegrations: unknown[] // Puedes tiparlo mejor si lo necesitas

  createdAt: string
  updatedAt: string
}
