const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { startOfMonth, addMonths } = require('../src/utils/date')

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

  await seedDemoData()

  console.log('Seed complete')
}

async function seedDemoData() {
  const demoPasswordHash = await bcrypt.hash('Demo@12345', 10)

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@campuscoin.local' },
    update: {},
    create: {
      name: 'Demo Student',
      email: 'demo@campuscoin.local',
      passwordHash: demoPasswordHash,
      role: 'STUDENT',
      academicYear: '2nd Year',
      monthlyAllowance: 500,
      monthlySavingsGoal: 100,
    },
  })

  const alreadySeeded = await prisma.transaction.count({ where: { userId: demoUser.id } })
  if (alreadySeeded > 0) {
    console.log('Demo data already present, skipping')
    return
  }

  const categories = await prisma.category.findMany({ where: { userId: null } })
  const byName = (name) => categories.find((c) => c.name === name)

  const thisMonth = startOfMonth(new Date())
  const lastMonth = addMonths(thisMonth, -1)

  const demoTransactions = [
    { category: 'Allowance', type: 'INCOME', amount: 500, day: 1, month: thisMonth, description: 'Monthly allowance' },
    { category: 'Part-time Job', type: 'INCOME', amount: 220, day: 15, month: thisMonth, description: 'Campus bookstore shift' },
    { category: 'Food', type: 'EXPENSE', amount: 45.5, day: 3, month: thisMonth, description: 'Groceries' },
    { category: 'Food', type: 'EXPENSE', amount: 18.75, day: 9, month: thisMonth, description: 'Dinner with friends' },
    { category: 'Food', type: 'EXPENSE', amount: 32.0, day: 20, month: thisMonth, description: 'Meal plan top-up' },
    { category: 'Transport', type: 'EXPENSE', amount: 25, day: 5, month: thisMonth, description: 'Bus pass' },
    { category: 'Hostel/Rent', type: 'EXPENSE', amount: 300, day: 1, month: thisMonth, description: 'Monthly rent' },
    { category: 'Academics', type: 'EXPENSE', amount: 60, day: 12, month: thisMonth, description: 'Textbooks' },
    { category: 'Subscriptions', type: 'EXPENSE', amount: 15.99, day: 7, month: thisMonth, description: 'Streaming subscription' },
    { category: 'Entertainment', type: 'EXPENSE', amount: 22, day: 18, month: thisMonth, description: 'Movie night' },
    { category: 'Allowance', type: 'INCOME', amount: 500, day: 1, month: lastMonth, description: 'Monthly allowance' },
    { category: 'Gift', type: 'INCOME', amount: 50, day: 10, month: lastMonth, description: 'Birthday gift' },
    { category: 'Food', type: 'EXPENSE', amount: 52.3, day: 4, month: lastMonth, description: 'Groceries' },
    { category: 'Transport', type: 'EXPENSE', amount: 25, day: 5, month: lastMonth, description: 'Bus pass' },
    { category: 'Hostel/Rent', type: 'EXPENSE', amount: 300, day: 1, month: lastMonth, description: 'Monthly rent' },
    { category: 'Entertainment', type: 'EXPENSE', amount: 40, day: 22, month: lastMonth, description: 'Concert ticket' },
    { category: 'Miscellaneous', type: 'EXPENSE', amount: 12.5, day: 27, month: lastMonth, description: 'Laundry' },
  ]

  for (const t of demoTransactions) {
    const category = byName(t.category)
    if (!category) continue
    await prisma.transaction.create({
      data: {
        userId: demoUser.id,
        categoryId: category.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        date: new Date(Date.UTC(t.month.getUTCFullYear(), t.month.getUTCMonth(), t.day)),
      },
    })
  }

  const demoBudgets = [
    { category: 'Food', limitAmount: 150 },
    { category: 'Transport', limitAmount: 30 },
    { category: 'Entertainment', limitAmount: 40 },
  ]

  for (const b of demoBudgets) {
    const category = byName(b.category)
    if (!category) continue
    await prisma.budget.upsert({
      where: { userId_categoryId_month: { userId: demoUser.id, categoryId: category.id, month: thisMonth } },
      update: {},
      create: {
        userId: demoUser.id,
        categoryId: category.id,
        month: thisMonth,
        limitAmount: b.limitAmount,
      },
    })
  }

  console.log('Demo user seeded: demo@campuscoin.local / Demo@12345')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
