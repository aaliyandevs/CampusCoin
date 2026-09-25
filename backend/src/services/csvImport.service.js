const { parse } = require('csv-parse/sync')
const prisma = require('../config/prisma')
const { csvRowSchema } = require('../validators/csvImport.validator')

const MAX_ROWS = 1000

function categoryKey(type, name) {
  return `${type}::${name.trim().toLowerCase()}`
}

async function loadCategoryMap(userId) {
  const categories = await prisma.category.findMany({
    where: { OR: [{ userId: null }, { userId }] },
  })

  const map = new Map()
  for (const category of categories) {
    map.set(categoryKey(category.type, category.name), category)
  }
  return map
}

async function resolveCategory(map, userId, type, name) {
  const key = categoryKey(type, name)
  const existing = map.get(key)
  if (existing) {
    return { category: existing, created: false }
  }

  const created = await prisma.category.create({
    data: { name: name.trim(), type, userId, isDefault: false },
  })
  map.set(key, created)
  return { category: created, created: true }
}

async function importTransactionsFromCsv(userId, fileBuffer) {
  let records
  try {
    records = parse(fileBuffer.toString('utf-8'), {
      columns: (header) => header.map((h) => h.trim().toLowerCase()),
      skip_empty_lines: true,
      trim: true,
    })
  } catch {
    throw new Error('Could not parse CSV file. Check that it is a valid CSV.')
  }

  if (records.length === 0) {
    return { totalRows: 0, imported: 0, failed: [], categoriesCreated: [] }
  }
  if (records.length > MAX_ROWS) {
    throw new Error(`CSV has too many rows. Maximum allowed is ${MAX_ROWS}.`)
  }

  const categoryMap = await loadCategoryMap(userId)
  const categoriesCreated = new Set()
  const failed = []
  const toInsert = []

  for (let i = 0; i < records.length; i += 1) {
    const rowNumber = i + 2
    const result = csvRowSchema.safeParse(records[i])

    if (!result.success) {
      failed.push({ row: rowNumber, reason: result.error.issues.map((e) => e.message).join('; ') })
      continue
    }

    const { date, type, category, amount, description } = result.data
    const { category: resolvedCategory, created } = await resolveCategory(
      categoryMap,
      userId,
      type,
      category,
    )
    if (created) {
      categoriesCreated.add(resolvedCategory.name)
    }

    toInsert.push({
      userId,
      categoryId: resolvedCategory.id,
      amount,
      type,
      description,
      date,
    })
  }

  if (toInsert.length > 0) {
    await prisma.transaction.createMany({ data: toInsert })
  }

  return {
    totalRows: records.length,
    imported: toInsert.length,
    failed,
    categoriesCreated: [...categoriesCreated],
  }
}

module.exports = { importTransactionsFromCsv }
