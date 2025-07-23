// src/app/api/whatsapp/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type MessageType = 'text' | 'template'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      businessId,
      type = 'text',
      message,
      templateName = 'hello_world',
    }: {
      businessId: string
      type?: MessageType
      message?: string
      templateName?: string
      to?: string
    } = body

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 })
    }

    const config = await prisma.businessWhatsappConfig.findFirst({
      where: { businessId },
    })

    if (!config) {
      return NextResponse.json({ error: 'No WhatsApp config found for this business' }, { status: 404 })
    }

    let to = body.to
    if ((config.environment === 'DEV' || config.environment === 'TEST') && config.testDestinationNumber) {
      to = config.testDestinationNumber
    }

    if (!to) {
      return NextResponse.json({ error: 'No destination number provided or configured for testing' }, { status: 400 })
    }

    const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`

    const payload =
      type === 'template'
        ? {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
              name: templateName,
              language: { code: 'en_US' },
            },
          }
        : type === 'text'
        ? {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: {
              preview_url: false,
              body: message || '',
            },
          }
        : null

    if (!payload) {
      return NextResponse.json({ error: 'Invalid message type' }, { status: 400 })
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API error:', result)
      return NextResponse.json({ error: 'Failed to send message', details: result }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
