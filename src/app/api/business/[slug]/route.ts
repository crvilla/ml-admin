import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BusinessStatus } from '@prisma/client/wasm'

// GET /api/business/[slug]
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  const slug = segments[segments.length - 1]

  if (!slug) {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
  }

  try {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        webhookToken: true,
      },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business no encontrado' }, { status: 404 })
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error('[BUSINESS_GET_BY_SLUG]', error)
    return new NextResponse('Error al obtener el cliente', { status: 500 })
  }
}

// PATCH /api/business/[slug]
export async function PATCH(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  const slug = segments[segments.length - 1]

  if (!slug) {
    return new NextResponse('Slug requerido', { status: 400 })
  }

  try {
    const body = await req.json()
    const { name, status, webhookToken } = body

    const data: {
      name?: string
      status?: BusinessStatus
      webhookToken?: string
    } = {}

    if (typeof name === 'string' && name.trim()) data.name = name
    if (typeof status === 'string' && status.trim()) {
      if (Object.values(BusinessStatus).includes(status as BusinessStatus)) {
        data.status = status as BusinessStatus
      } else {
        return new NextResponse('Status inválido', { status: 400 })
      }
    }
    if (typeof webhookToken === 'string' && webhookToken.trim()) data.webhookToken = webhookToken

    if (Object.keys(data).length === 0) {
      return new NextResponse('No hay campos válidos para actualizar', { status: 400 })
    }

    const updated = await prisma.business.update({
      where: { slug },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[BUSINESS_PATCH_BY_SLUG]', error)
    return new NextResponse('Error al actualizar el negocio', { status: 500 })
  }
}

// POST /api/business/[slug]
export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  const slug = segments[segments.length - 1]

  console.log('[API CALL] URL completa:', req.url)
  console.log('[API CALL] Slug extraído:', slug)

  if (!slug) {
    console.warn('[VALIDATION ERROR] Slug requerido')
    return new NextResponse('Slug requerido', { status: 400 })
  }

  try {
    const body = await req.json()
    const { apiKeyPrivate } = body

    console.log('[REQUEST BODY]', body)

    if (!apiKeyPrivate || typeof apiKeyPrivate !== 'string') {
      console.warn('[VALIDATION ERROR] apiKeyPrivate inválido o ausente')
      return new NextResponse('apiKeyPrivate requerido y debe ser string', { status: 400 })
    }

    // Validación contra el token de desarrollo
    if (apiKeyPrivate === process.env.TOKEN_DEV) {
      console.log('[TOKEN VALIDACIÓN] Token de desarrollo válido')
      return NextResponse.json({ valid: true })
    }

    const business = await prisma.business.findUnique({
      where: { slug },
      select: { apiKeyPrivate: true },
    })

    console.log('[BUSINESS FOUND]', business)

    if (!business) {
      console.warn('[NOT FOUND] Negocio no encontrado para slug:', slug)
      return new NextResponse('Negocio no encontrado', { status: 404 })
    }

    const isValid = business.apiKeyPrivate === apiKeyPrivate
    console.log('[VALIDACIÓN FINAL] ¿Es válido?', isValid)

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error('[BUSINESS_VALIDATE_APIKEY] Error:', error)
    return new NextResponse('Error al validar el apiKey', { status: 500 })
  }
}

