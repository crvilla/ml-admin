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
    const configs = await prisma.businessWhatsappConfig.findMany({
      where: { businessId },
      select: { id: true, name: true },
    })

    return NextResponse.json(configs)
  } catch (err) {
    console.error('[GET] Error fetching WhatsApp config:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

