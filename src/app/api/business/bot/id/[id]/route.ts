import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function getBotIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function GET(req: NextRequest) {
  const botId = getBotIdFromUrl(req)

  if (!botId) {
    return NextResponse.json({ error: 'Bot ID requerido' }, { status: 400 })
  }

  try {
    const bot = await prisma.businessBot.findUnique({
      where: { id: botId },
      include: {
        whatsappConfig: true,
        apiIntegrations: {
          select: {
            id: true,
            status: true,
            publicApiKey: true,
            api: {
              select: {
                name: true,
                type: true,
              },
            },
            subApis: {
              select: {
                status: true,
                api: {
                  select: {
                    name: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!bot) {
      return NextResponse.json({ error: 'Bot no encontrado' }, { status: 404 })
    }

    return NextResponse.json(bot)
  } catch (error) {
    console.error('[GET BOT DETAIL]', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const botId = getBotIdFromUrl(req)

  if (!botId) {
    return NextResponse.json({ error: 'Bot ID requerido' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { name, description, webhookURL, whatsappConfigId, webhookTestURL } = body

    await prisma.businessBot.update({
      where: { id: botId },
      data: {
        name,
        description,
        webhookURL,
        webhookTestURL,
        whatsappConfigId,
      },
    })

    const updatedBot = await prisma.businessBot.findUnique({
      where: { id: botId },
      include: {
        whatsappConfig: true,
        apiIntegrations: true,
      },
    })

    return NextResponse.json(updatedBot)
  } catch (error) {
    console.error('[PUT BOT DETAIL]', error)
    return NextResponse.json({ error: 'Error al actualizar bot' }, { status: 500 })
  }
}
