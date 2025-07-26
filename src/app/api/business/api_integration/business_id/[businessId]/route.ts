import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Ajusta el path si está en otro lugar

function getBusinessIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function POST(req: NextRequest) {
  const businessId = getBusinessIdFromUrl(req)
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required in URL' }, { status: 400 })
  }

  const body = await req.json()
  const { apiName, env, externalId, publicApiKey, status } = body

  if (!apiName || !env || !externalId || !publicApiKey || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Buscar el API en el catálogo
    const apiCatalog = await prisma.apiIntegrationCatalog.findUnique({
      where: {
        name_type: {
          name: apiName,
          type: env.toUpperCase(), // 'DEV' o 'PROD'
        },
      },
    })

    if (!apiCatalog) {
      return NextResponse.json({ error: 'API Catalog not found' }, { status: 404 })
    }

    const integration = await prisma.businessApiIntegration.create({
      data: {
        businessId,
        apiId: apiCatalog.id,
        externalId,
        publicApiKey,
        status,
      },
    })

    return NextResponse.json(integration)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating integration' }, { status: 500 })
  }
}
