const prisma = require('../config/prisma')
const { addInterval } = require('../utils/date')

const MAX_OCCURRENCES_PER_RUN = 24

async function generateDueRecurringTransactions(userId) {
  const dueTemplates = await prisma.transaction.findMany({
    where: {
      userId,
      isRecurringTemplate: true,
      nextOccurrenceDate: { lte: new Date() },
    },
  })

  for (const template of dueTemplates) {
    let occurrenceDate = template.nextOccurrenceDate
    let iterations = 0

    while (occurrenceDate <= new Date() && iterations < MAX_OCCURRENCES_PER_RUN) {
      await prisma.transaction.create({
        data: {
          userId: template.userId,
          categoryId: template.categoryId,
          amount: template.amount,
          type: template.type,
          description: template.description,
          date: occurrenceDate,
          recurringSourceId: template.id,
        },
      })

      occurrenceDate = addInterval(occurrenceDate, template.recurrenceInterval)
      iterations += 1
    }

    await prisma.transaction.update({
      where: { id: template.id },
      data: { nextOccurrenceDate: occurrenceDate },
    })
  }
}

module.exports = { generateDueRecurringTransactions }
