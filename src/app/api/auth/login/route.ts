// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_name, password } = body

    if (!user_name || !password) {
      return NextResponse.json({ error: 'Credenciales incompletas' }, { status: 400 })
    }

    // 🟢 Buscar usuario en la nueva tabla UserAdmin
    const user = await prisma.userAdmin.findUnique({
      where: { user_name },
      include: { role: true }, // relación con RoleAdmin
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    // 🟢 Crear token con los datos de UserAdmin
    const token = jwt.sign(
      {
        id: user.id,
        user_name: user.user_name,
        role: user.role.name,
        changePassword: user.changePassword,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // 🟢 Crear respuesta y cookie
    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        user_name: user.user_name,
        role: user.role.name,
        changePassword: user.changePassword,
      },
    })

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
