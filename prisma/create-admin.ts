import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'admin@swiftshop.com'
  const password = 'adminpassword123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword, // Ensure password is updated
    },
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Admin user created/updated: ${admin.email}`)
  console.log(`🔑 Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
