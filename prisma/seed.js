import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const roles = ['admin', 'comercial']

  for (const roleName of roles) {
    const exists = await prisma.role.findUnique({
      where: { name: roleName },
    })

    if (exists) {
      console.log(`⚠️ Rol "${roleName}" ya existe con id ${exists.id}`)
    } else {
      const newRole = await prisma.role.create({
        data: { name: roleName },
      })
      console.log(`✅ Rol "${roleName}" creado con id ${newRole.id}`)
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
