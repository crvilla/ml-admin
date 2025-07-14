// src/app/api/business/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(businesses)
  } catch (error) {
    console.error('[BUSINESS_GET]', error)
    return new NextResponse('Error fetching businesses', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return new NextResponse('El nombre es obligatorio', { status: 400 })
    }

    const apiKeyPrivate = crypto.randomBytes(32).toString('hex') // 64 chars

    const business = await prisma.business.create({
      data: {
        name,
        apiKeyPrivate,
        status: 'PENDING',
      },
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    console.error('[BUSINESS_POST]', error)
    return new NextResponse('Error al crear cliente', { status: 500 })
  }
}
