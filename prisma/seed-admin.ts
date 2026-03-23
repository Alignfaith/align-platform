import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'thomas@dstormpg.com'
  const tempPassword = 'RootedAdmin2024!'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`User ${email} already exists (id: ${existing.id}, role: ${existing.role})`)
    if (existing.role !== 'ADMIN') {
      await prisma.user.update({ where: { id: existing.id }, data: { role: 'ADMIN', mustChangePassword: true } })
      console.log('Updated role to ADMIN and set mustChangePassword = true')
    }
    return
  }

  const passwordHash = await bcrypt.hash(tempPassword, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'ADMIN',
      mustChangePassword: true,
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: 'Thomas',
          lastName: 'Marks',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'MALE',
          seekingGender: 'FEMALE',
          city: '',
          state: '',
          isComplete: false,
        },
      },
    },
  })

  console.log('')
  console.log('=== Admin User Created ===')
  console.log(`  Name:     Thomas Marks`)
  console.log(`  Email:    ${email}`)
  console.log(`  Role:     ADMIN`)
  console.log(`  User ID:  ${user.id}`)
  console.log(`  Temp PW:  ${tempPassword}`)
  console.log('')
  console.log('  Login:     https://rootedalign.fly.dev/login')
  console.log('  Dashboard: https://rootedalign.fly.dev/admin')
  console.log('')
  console.log('Password change will be required on first login.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
