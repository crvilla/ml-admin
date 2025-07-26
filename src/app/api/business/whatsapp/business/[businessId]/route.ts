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

export async function POST(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const {
      name,
      wabaId,
      phoneNumberId,
      senderPhoneNumber,
      accessToken,
      environment,
      testDestinationNumber,
    } = body

    if (
      !name ||
      !wabaId ||
      !phoneNumberId ||
      !senderPhoneNumber ||
      !accessToken ||
      !environment
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const created = await prisma.businessWhatsappConfig.create({
      data: {
        businessId,
        name,
        wabaId,
        phoneNumberId,
        senderPhoneNumber,
        accessToken,
        environment,
        testDestinationNumber,
      },
    })

    return NextResponse.json(created)
  } catch (err) {
    console.error('[POST] Error creating WhatsApp config:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

