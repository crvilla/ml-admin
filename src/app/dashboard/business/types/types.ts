
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