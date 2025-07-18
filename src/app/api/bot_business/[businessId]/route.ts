import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getBusinessIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function GET(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  try {
    const bots = await prisma.businessBot.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bots)
  } catch (error) {
    console.error('[GET] Error fetching bots:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { name, description, webhookURL, whatsappConfigId } = body

    if (!name || !webhookURL || !whatsappConfigId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const newBot = await prisma.businessBot.create({
      data: {
        name,
        description,
        webhookURL,
        businessId,
        whatsappConfigId,
      },
    })

    return NextResponse.json(newBot, { status: 201 })
  } catch (error) {
    console.error('[POST] Error creating bot:', error)
    return NextResponse.json({ error: 'Error al crear el bot' }, { status: 500 })
  }
}

