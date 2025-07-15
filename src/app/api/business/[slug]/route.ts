import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/business/[slug]
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params

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
export async function PATCH(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { webhookToken } = await req.json()

    if (!webhookToken || typeof webhookToken !== 'string') {
      return new NextResponse('Token inválido', { status: 400 })
    }

    const updated = await prisma.business.update({
      where: { slug: context.params.slug },
      data: { webhookToken },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[BUSINESS_PATCH_BY_SLUG]', error)
    return new NextResponse('Error al actualizar el token', { status: 500 })
  }
}
