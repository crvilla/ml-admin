import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getIdFromUrl } from '@/lib/helpers'

export async function GET(req: NextRequest) {
  const botId = getIdFromUrl(req)

  if (!botId) {
    return NextResponse.json({ error: 'Bot ID requerido' }, { status: 400 })
  }

  try {
    const bot = await prisma.businessBot.findUnique({
      where: { id: botId },
      include: {
        apiIntegrations: {
          select: {
            publicApiKey: true,
            api: {
              select: {
                baseUrl: true,
              },
            },
          },
        },
      },
    })

    if (!bot) {
      return NextResponse.json({ error: 'Bot no encontrado' }, { status: 404 })
    }

    const integration = bot.apiIntegrations[0]

    if (!integration?.api?.baseUrl || !integration.publicApiKey || !bot.simulatedPhone) {
      return NextResponse.json({ error: 'Datos incompletos en la integración' }, { status: 400 })
    }

    const res = await fetch(`${integration.api.baseUrl}/api/messages?phone=${bot.simulatedPhone}`, {
      headers: {
        'x-business-token': integration.publicApiKey,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'No se pudo obtener historial desde API externa' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET BOT MESSAGES]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const botId = getIdFromUrl(req)
  if (!botId) return NextResponse.json({ error: 'Bot ID requerido' }, { status: 400 })

  try {
    const body = await req.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto del mensaje requerido' }, { status: 400 })
    }

    const bot = await prisma.businessBot.findUnique({
      where: { id: botId },
      include: {
        whatsappConfig: true,
        apiIntegrations: {
          include: {
            api: true,
            subApis: { include: { api: true } },
          },
        },
      },
    })

    if (!bot) return NextResponse.json({ error: 'Bot no encontrado' }, { status: 404 })
    if (!bot.simulatedPhone) return NextResponse.json({ error: 'Bot sin número simulado' }, { status: 400 })

    const env = bot.whatsappConfig?.environment || 'PROD'
    const url = env === 'PROD' ? bot.webhookURL : bot.webhookTestURL
    if (!url) return NextResponse.json({ error: 'No hay webhook configurado' }, { status: 400 })

    const integration = bot.apiIntegrations[0]
    const xBusinessToken = integration?.publicApiKey || ''
    const urlLmBussines = integration?.api?.baseUrl || ''

    let urlLmLead = ''
    for (const subApi of integration?.subApis || []) {
      if (subApi.api?.name === 'leads_api' && subApi.api.baseUrl) {
        urlLmLead = subApi.api.baseUrl
        break
      }
    }

    const contact = {
      wa_id: bot.simulatedPhone,
      profile: {
        name: bot.name,
      },
    }

    const message = {
      from: bot.simulatedPhone,
      id: `wamid.${Date.now()}`,
      timestamp: `${Math.floor(Date.now() / 1000)}`,
      type: 'text',
      text: { body: text },
    }

    const fullPayload = {
      entry: [{
        id: 'dummy_id',
        changes: [{
          value: {
            messages: [message],
            contacts: [contact],
          },
        }],
      }],
    }

    const payloadToSend = {
      type: 'text',
      botId: bot.id,
      botName: bot.name,
      contact,
      message,
      fullPayload,
      x_business_token: xBusinessToken,
      url_lm_bussines: urlLmBussines,
      url_lm_lead: urlLmLead,
    }

    let success = false
    let attempt = 0
    while (attempt < 2 && !success) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadToSend),
        })

        if (response.ok) {
          success = true
        } else {
          console.warn(`❌ Error del webhook (status ${response.status}) intento ${attempt + 1}`)
        }
      } catch (err) {
        console.error(`❌ Error en intento ${attempt + 1}:`, err)
      }
      attempt++
    }

    if (!success) {
      return NextResponse.json({ error: 'No se pudo contactar al webhook' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST BOT MESSAGE]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

