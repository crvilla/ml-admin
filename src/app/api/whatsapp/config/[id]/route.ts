import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getWhatsappConfigIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function PUT(req: NextRequest) {
  const whatsappConfigId = getWhatsappConfigIdFromUrl(req)

  if (!whatsappConfigId) {
    return NextResponse.json({ error: 'ID de configuración requerido' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { accessToken, environment, testDestinationNumber } = body

    const updatedConfig = await prisma.businessWhatsappConfig.update({
      where: { id: whatsappConfigId },
      data: {
        accessToken,
        environment,
        testDestinationNumber: environment === 'PROD' ? null : testDestinationNumber,
      },
    })

    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error('[PUT WHATSAPP CONFIG]', error)
    return NextResponse.json({ error: 'Error al actualizar la configuración' }, { status: 500 })
  }
}
