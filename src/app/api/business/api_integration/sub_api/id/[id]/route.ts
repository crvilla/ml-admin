import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIdFromUrl } from '@/lib/helpers'

// PUT → Actualizar status de una sub API
export async function PUT(req: NextRequest) {
  const subApiId = getIdFromUrl(req)

  if (!subApiId) {
    return NextResponse.json({ error: 'Missing Sub API ID' }, { status: 400 })
  }

  const body = await req.json()
  const { status } = body

  if (!status) {
    return NextResponse.json({ error: 'Missing status field' }, { status: 400 })
  }

  try {
    const updated = await prisma.businessSubApi.update({
      where: { id: subApiId },
      data: {
        status,
      },
      select: {
        id: true,
        apiId: true,
        externalId: true,
        status: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('❌ Error updating sub API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
