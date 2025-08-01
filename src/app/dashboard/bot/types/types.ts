export type Bot = {
  id: string
  name: string
  description: string | null
  webhookURL: string
  webhookTestURL?: string | null
  whatsappConfig: {
    id: string
    name: string
  }
  businessId: string
}

export type Environment = 'DEV' | 'TEST' | 'PROD'

export type WhatsappConfig = {
  id: string
  name: string
  wabaId: string
  phoneNumberId: string
  senderPhoneNumber: string
  accessToken: string
  environment: Environment
  testDestinationNumber: string | null
}
