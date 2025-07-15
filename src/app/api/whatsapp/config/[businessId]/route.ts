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
    const config = await prisma.businessWhatsappConfig.findUnique({
      where: { businessId },
    })

    if (!config) {
      return NextResponse.json({ error: 'WhatsApp config not found' }, { status: 404 })
    }

    return NextResponse.json(config)
  } catch (err) {
    console.error('[GET] Error fetching WhatsApp config:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const {
      wabaId,
      phoneNumberId,
      senderPhoneNumber,
      accessToken,
      environment,
      testDestinationNumber,
    } = body

    if (!wabaId || !phoneNumberId || !senderPhoneNumber || !accessToken || !environment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updated = await prisma.businessWhatsappConfig.upsert({
      where: { businessId },
      update: {
        wabaId,
        phoneNumberId,
        senderPhoneNumber,
        accessToken,
        environment,
        testDestinationNumber,
      },
      create: {
        businessId,
        wabaId,
        phoneNumberId,
        senderPhoneNumber,
        accessToken,
        environment,
        testDestinationNumber,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT] Error saving WhatsApp config:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
