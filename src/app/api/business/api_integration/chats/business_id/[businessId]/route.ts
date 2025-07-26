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

  console.log('[INFO] Incoming POST to /api/business/name/[slug] with env:', env)
  console.log('[INFO] businessId extracted from URL:', businessId)

  if (!businessId) {
    return NextResponse.json({ error: 'No se encontró businessId en la URL' }, { status: 400 })
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { apiKeyPrivate: true, slug: true },
  })

  console.log('[LOOKUP] Business found:', business)

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  const catalog = await prisma.apiIntegrationCatalog.findFirst({
    where: {
      name: 'chats_api',
      type: env,
    },
    select: { baseUrl: true },
  })

  console.log('[LOOKUP] Catalog found:', catalog)

  if (!catalog) {
    return NextResponse.json({ error: 'No se encontró la API en el catálogo' }, { status: 500 })
  }

  const targetUrl = `${catalog.baseUrl}api/business`
  console.log('[REQUEST] Calling targetUrl:', targetUrl)

  const hostname = req.headers.get('host')
  const isLocalhost = hostname?.includes('localhost')

  const tokenPrivate = isLocalhost || env === 'PROD'
    ? process.env.TOKEN_DEV
    : business.apiKeyPrivate

  console.log('[TOKEN] Using tokenPrivate:', tokenPrivate)
  console.log('[SLUG] Using slug:', business.slug)

  const bodyPayload = {
    apiKeyPrivate: tokenPrivate,
    slug: business.slug,
  }

  console.log('[BODY] Sending payload to targetUrl:', bodyPayload)

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyPayload),
  })

  const data = await res.json()

  console.log('[RESPONSE] Response from chats_api:', {
    status: res.status,
    body: data,
  })

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  return NextResponse.json({ message: 'OK', data })
}

