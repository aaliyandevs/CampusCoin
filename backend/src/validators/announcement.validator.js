const { z } = require('zod')

const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1).max(150),
  body: z.string().trim().min(1).max(5000),
})

const updateAnnouncementSchema = createAnnouncementSchema

module.exports = { createAnnouncementSchema, updateAnnouncementSchema }
