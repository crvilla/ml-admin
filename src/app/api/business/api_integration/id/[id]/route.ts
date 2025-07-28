import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIdFromUrl } from '@/lib/helpers'

// GET → Obtener detalle de una integración
export async function GET(req: NextRequest) {
  const apiIntegrationId = getIdFromUrl(req)

  if (!apiIntegrationId) {
    return NextResponse.json({ error: 'Missing API Integration ID' }, { status: 400 })
  }

  try {
    const integration = await prisma.businessApiIntegration.findUnique({
      where: { id: apiIntegrationId },
      select: {
        id: true,
        publicApiKey: true,
        externalId: true,
        status: true,
        bot: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        subApis: {
          select: {
            id: true,
            apiId: true,
            externalId: true,
            status: true,
            api: {
              select: {
                name: true,
                type: true,
              }
            }
          }
        }
      }
    })

    if (!integration) {
      return NextResponse.json({ error: 'API Integration not found' }, { status: 404 })
    }

    return NextResponse.json(integration)
  } catch (error) {
    console.error('Error fetching API integration:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT → Actualizar status y botId de una integración
export async function PUT(req: NextRequest) {
  const apiIntegrationId = getIdFromUrl(req)

  if (!apiIntegrationId) {
    return NextResponse.json({ error: 'Missing API Integration ID' }, { status: 400 })
  }

  const body = await req.json()
  const { status, botId } = body

  if (!status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const updated = await prisma.businessApiIntegration.update({
      where: { id: apiIntegrationId },
      data: {
        status,
        botId: botId || null, // puede ser null si quiere quitarlo
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating API integration:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
