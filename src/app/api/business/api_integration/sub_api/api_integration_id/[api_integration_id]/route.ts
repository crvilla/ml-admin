import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getApiIntegrationIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function POST(req: NextRequest) {
  const apiIntegrationId = getApiIntegrationIdFromUrl(req)
  if (!apiIntegrationId) {
    return NextResponse.json({ error: 'Missing API Integration ID in URL' }, { status: 400 })
  }

  const body = await req.json()
  const { env, apiName = 'leads_api' } = body // <-- Permite que apiName llegue como parámetro

  if (!env || !['DEV', 'PROD'].includes(env.toUpperCase())) {
    return NextResponse.json({ error: 'Invalid or missing env' }, { status: 400 })
  }

  try {
    // Buscar la integración principal (chat)
    const apiChat = await prisma.businessApiIntegration.findUnique({
      where: { id: apiIntegrationId },
      include: { business: true },
    })

    if (!apiChat) {
      return NextResponse.json({ error: 'API Chat Integration not found' }, { status: 404 })
    }

    const business = apiChat.business

    // Buscar en catálogo la sub-API según el nombre recibido
    const leadsCatalog = await prisma.apiIntegrationCatalog.findUnique({
      where: {
        name_type: {
          name: apiName,
          type: env.toUpperCase(),
        },
      },
    })

    if (!leadsCatalog) {
      return NextResponse.json({ error: `${apiName} Catalog not found` }, { status: 404 })
    }

    // Llamar al monolito externo para registrar el business lead
    const response = await fetch(`${leadsCatalog.baseUrl}/api/business`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: business.name,
        token: apiChat.publicApiKey,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: 'Error creating business in sub API', details: errorData },
        { status: response.status }
      )
    }

    const result = await response.json()
    const externalId = (result.business?.id || result.id)?.toString()

    if (!externalId) {
      return NextResponse.json(
        { error: 'Missing external ID in sub API response' },
        { status: 500 }
      )
    }

    // Guardar en BusinessSubApi
    const subApi = await prisma.businessSubApi.create({
      data: {
        apiChatId: apiChat.id,
        apiId: leadsCatalog.id,
        externalId,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json(subApi)
  } catch (error) {
    console.error('Error activating sub API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
