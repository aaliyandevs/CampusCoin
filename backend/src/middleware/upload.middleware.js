const multer = require('multer')

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')
    if (!isCsv) {
      const err = new Error('Only CSV files are allowed')
      err.status = 400
      return cb(err)
    }
    cb(null, true)
  },
})

module.exports = { csvUpload }
