import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getBusinessIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

// GET /api/business/id/[id]
export async function GET(req: NextRequest) {
 const businessId = getBusinessIdFromUrl(req)

  if (!businessId) {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
  }

  try {
    const business = await prisma.business.findMany({
      where: { id: businessId },
      select: { id: true, name: true },
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


