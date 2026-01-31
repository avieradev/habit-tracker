const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('clave123', 10)
  
  const user = await prisma.user.create({
    data: {
      username: 'adri',
      password: hashedPassword
    }
  })
  
  console.log('Usuario creado:', user.username)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
