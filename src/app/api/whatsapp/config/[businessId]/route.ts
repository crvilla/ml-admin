import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { businessId: string } }) {
  const { businessId } = params

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

export async function PUT(req: NextRequest, { params }: { params: { businessId: string } }) {
  const { businessId } = params

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
      testDestinationNumber, // ← nuevo campo opcional
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
