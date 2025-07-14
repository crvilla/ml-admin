import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_name, password, role } = body

    // Validación básica
    if (!user_name || !password || !role) {
      return NextResponse.json(
        { error: 'Campos obligatorios faltantes: user_name, password y role' },
        { status: 400 }
      )
    }

    // Validar si ya existe un usuario con ese user_name
    const existingUser = await prisma.user.findUnique({
      where: { user_name },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: `El usuario "${user_name}" ya existe` },
        { status: 409 }
      )
    }

    // Buscar el rol
    const foundRole = await prisma.role.findUnique({
      where: { name: role },
    })

    if (!foundRole) {
      return NextResponse.json(
        { error: `El rol "${role}" no existe` },
        { status: 400 }
      )
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        user_name,
        password: hashedPassword,
        roleId: foundRole.id,
        changePassword: true,
      },
      select: {
        id: true,
        user_name: true,
        role: {
          select: {
            id: true,
            name: true
          }
        },
        changePassword: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
