import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
    const bot = await prisma.businessBot.findUnique({
      where: { id: businessId },
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
