const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const incomeCategories = ['Allowance', 'Part-time Job', 'Scholarship', 'Gift', 'Other Income']
const expenseCategories = [
  'Food',
  'Transport',
  'Hostel/Rent',
  'Academics',
  'Subscriptions',
  'Entertainment',
  'Miscellaneous',
]

async function seedDefaultCategory(name, type) {
  const existing = await prisma.category.findFirst({
    where: { userId: null, name, type },
  })

  if (!existing) {
    await prisma.category.create({ data: { name, type, isDefault: true } })
  }
}

async function main() {
  for (const name of incomeCategories) {
    await seedDefaultCategory(name, 'INCOME')
  }

  for (const name of expenseCategories) {
    await seedDefaultCategory(name, 'EXPENSE')
  }

  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10)

  await prisma.user.upsert({
    where: { email: 'admin@campuscoin.local' },
    update: {},
    create: {
      name: 'Campus Coin Admin',
      email: 'admin@campuscoin.local',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  console.log('Seed complete')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
