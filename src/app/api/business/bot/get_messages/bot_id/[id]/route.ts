// src/app/api/business/bot/get_messages/bot_id/[id]/route.ts

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
