import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BusinessStatus } from '@prisma/client'

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