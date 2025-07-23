import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getBusinessIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function GET(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)
  const env = req.nextUrl.searchParams.get('env')?.toUpperCase() as 'DEV' | 'PROD'

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  if (!env || (env !== 'DEV' && env !== 'PROD')) {
    return NextResponse.json({ error: 'Invalid or missing env param (DEV or PROD)' }, { status: 400 })
  }

  try {
    const integration = await prisma.businessApiIntegration.findFirst({
      where: {
        businessId,
        api: {
          name: 'chats_api',
          type: env,
        },
      },
      include: {
        api: true,
        bot: true,
      },
    })

    if (!integration) {
      return NextResponse.json({ exists: false })
    }

    return NextResponse.json({
      exists: true,
      integration,
    })
  } catch (error) {
    console.error('[GET /business-api/chats] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)
  const env = req.nextUrl.searchParams.get('env')?.toUpperCase() as 'DEV' | 'PROD'

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  if (!env || (env !== 'DEV' && env !== 'PROD')) {
    return NextResponse.json({ error: 'Invalid or missing env param (DEV or PROD)' }, { status: 400 })
  }

  try {
    // Buscar la API de chats_api para ese entorno
    const api = await prisma.apiIntegrationCatalog.findFirst({
      where: {
        name: 'chats_api',
        type: env,
      },
    })

    if (!api) {
      return NextResponse.json({ error: 'API catalog not found for chats_api in this environment' }, { status: 404 })
    }

    // Obtener el negocio y su apiKeyPrivate
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { apiKeyPrivate: true },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Llamar a la API externa para registrar el negocio
    const res = await fetch(`${api.baseUrl}/api/business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token_private: business.apiKeyPrivate,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Error from chats_api:', err)
      return NextResponse.json({ error: 'Failed to create business in chats_api' }, { status: 500 })
    }

    const data = await res.json()
    const { businessId: externalId, token: publicApiKey } = data

    // Crear integración en base de datos
    const integration = await prisma.businessApiIntegration.create({
      data: {
        businessId,
        apiId: api.id,
        externalId,
        publicApiKey,
        status: 'INACTIVE',
        botId: null,
      },
    })

    return NextResponse.json({ message: 'API registrada con éxito', integration }, { status: 201 })
  } catch (error) {
    console.error('[POST /business-api/chats] Error:', error)
    return NextResponse.json({ error: 'Error al registrar la API' }, { status: 500 })
  }
}


