import { prisma } from '@/lib/prisma'

export async function sendWhatsAppMessage({
  botId,
  phone,
  message,
}: {
  botId: string
  phone: string
  message: string
}) {
  const bot = await prisma.businessBot.findUnique({
    where: { id: botId },
    include: {
      whatsappConfig: true,
    },
  })

  if (!bot || !bot.whatsappConfig) {
    console.warn('⚠️ No se encontró el bot o su configuración de WhatsApp')
    return
  }

  const config = bot.whatsappConfig
  const to = config.environment === 'PROD' ? phone : config.testDestinationNumber

  if (!to) {
    console.warn('⚠️ No hay número de prueba configurado')
    return
  }

  const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body: message,
    },
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Error enviando mensaje a WhatsApp API:', result)
    } else {
      console.log('📤 Mensaje enviado con éxito a WhatsApp:', result)
    }
  } catch (err) {
    console.error('❌ Error inesperado al enviar mensaje a WhatsApp:', err)
  }
}
