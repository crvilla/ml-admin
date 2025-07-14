import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Obtener un business por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse> {
  try {
    const business = await prisma.business.findUnique({
      where: { slug: params.slug },
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

// Actualizar webhookToken de un business por slug
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse> {
  try {
    const { webhookToken } = await request.json()

    if (!webhookToken || typeof webhookToken !== 'string') {
      return new NextResponse('Token inválido', { status: 400 })
    }

    const updated = await prisma.business.update({
      where: { slug: params.slug },
      data: { webhookToken },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[BUSINESS_PATCH_BY_SLUG]', error)
    return new NextResponse('Error al actualizar el token', { status: 500 })
  }
}
