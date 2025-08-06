// src/types/whatsapp.ts

export interface WhatsAppMessage {
  from: string
  id: string
  timestamp: string
  type: string
  text?: { body: string }
  image?: object
  audio?: object
  video?: object
  document?: object
  sticker?: object
  location?: object
  contacts?: object
  interactive?: object
}

export interface WhatsAppContact {
  profile: { name: string }
  wa_id: string
}

export interface WhatsAppPayload {
  messaging_product: string
  metadata: {
    display_phone_number: string
    phone_number_id: string
  }
  contacts: WhatsAppContact[]
  messages: WhatsAppMessage[]
}
