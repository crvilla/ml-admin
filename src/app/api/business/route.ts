// src/app/api/business/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET() {
  try {
    const businesses = await prisma.businessAdmin.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(businesses)
  } catch (error) {
    console.error('[BUSINESS_GET]', error)
    return new NextResponse('Error fetching businesses', { status: 500 })
  }
}

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let counter = 1

  while (await prisma.businessAdmin.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return new NextResponse('El nombre es obligatorio', { status: 400 })
    }

    const slug = await generateUniqueSlug(name)
    const apiKeyPrivate = crypto.randomBytes(32).toString('hex')

    const business = await prisma.businessAdmin.create({
      data: {
        name,
        slug,
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

