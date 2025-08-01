import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIdFromUrl } from '@/lib/helpers'

// GET: Validación del webhook de WhatsApp
export async function GET(req: NextRequest) {
  const botId = getIdFromUrl(req)

  if (!botId) {
    return new NextResponse('ID de bot inválido', { status: 400 })
  }

  const searchParams = req.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (!mode || !token || !challenge) {
    return new NextResponse('Faltan parámetros', { status: 400 })
  }

  const bot = await prisma.businessBot.findUnique({
    where: { id: botId },
  })

  if (!bot || bot.whatsappWebhookToken !== token) {
    return new NextResponse('Token inválido', { status: 403 })
  }

  return new NextResponse(challenge, { status: 200 })
}

// POST: Recepción de mensajes entrantes
export async function POST(req: NextRequest) {
  const botId = getIdFromUrl(req)

  try {
    if (!botId) {
      return new NextResponse('ID de bot inválido', { status: 400 })
    }

    const body = await req.json()

    const bot = await prisma.businessBot.findUnique({
      where: { id: botId },
    })

    if (!bot) {
      return new NextResponse('Bot no encontrado', { status: 404 })
    }

    if (body.object !== 'whatsapp_business_account') {
      return new NextResponse('No es un evento de WhatsApp', { status: 400 })
    }

    const entries = body.entry || []

    for (const entry of entries) {
      const changes = entry.changes || []

      for (const change of changes) {
        if (change.field !== 'messages') continue

        const value = change.value
        const contact = value.contacts?.[0]
        const message = value.messages?.[0]

        console.log(`📩 Mensaje recibido para el bot: ${bot.name}`)
        console.log(`👤 Nombre: ${contact?.profile?.name || 'Desconocido'}`)
        console.log(`📱 Teléfono: ${contact?.wa_id || message?.from}`)
        console.log(`🕒 Timestamp: ${message?.timestamp}`)
        console.log(`💬 Texto: ${message?.text?.body}`)
        console.log('📦 Payload completo:')
        console.dir(value, { depth: null })
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (err) {
    console.error('[WEBHOOK_POST_ERROR]', err)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}
