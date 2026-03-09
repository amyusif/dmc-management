import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function addUser() {
  try {
    // Get command line arguments or use defaults
    const username = process.argv[2] || 'admin'
    const password = process.argv[3] || 'password'
    const name = process.argv[4] || 'Admin User'
    const email = process.argv[5] || 'admin@hospital.com'
    const role = process.argv[6] || 'ADMIN'

    console.log(`[add-user] Creating user: ${username}`)

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      console.log(`[add-user] User ${username} already exists`)
      process.exit(0)
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role,
        active: true,
      },
    })

    console.log(`[add-user] User created successfully:`)
    console.log(`  Username: ${user.username}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  ID: ${user.id}`)
  } catch (error) {
    console.error('[add-user] Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addUser()
