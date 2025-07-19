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

  const apiCatalogEntries = [
    { name: 'leads_api', type: 'PROD', baseUrl: 'https://ml-dashboard-client-six.vercel.app/' },
    { name: 'chats_api', type: 'PROD', baseUrl: 'https://ml-business-api-seven.vercel.app/' },
    { name: 'leads_api', type: 'DEV', baseUrl: 'https://ml-dashboard-client.vercel.app/' },
    { name: 'chats_api', type: 'DEV', baseUrl: 'https://ml-business-api.vercel.app/' },
  ]

  for (const api of apiCatalogEntries) {
    const exists = await prisma.apiIntegrationCatalog.findFirst({
      where: {
        name: api.name,
        type: api.type,
      },
    })

    if (exists) {
      console.log(`⚠️ API "${api.name}" (${api.type}) ya existe`)
    } else {
      const newApi = await prisma.apiIntegrationCatalog.create({
        data: api,
      })
      console.log(`✅ API "${newApi.name}" (${newApi.type}) creada`)
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
