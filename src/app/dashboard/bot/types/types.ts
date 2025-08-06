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
  simulatedPhone?: string 
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

export type SubApi = {
  status: string
  api: {
    name: string
    type: string
  }
}

export type ApiIntegration = {
  id: string
  status: string
  publicApiKey: string
  api: {
    name: string
    type: string
  }
  subApis: SubApi[]
}

export type Message = {
  sender: 'user' | 'bot'
  text: string
}

export type ApiResponse = {
  messages: {
    id: string
    content: string
    createdAt: string
    sender: string
  }[]
}


