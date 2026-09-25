const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/auth.routes')
const categoryRoutes = require('./routes/category.routes')
const transactionRoutes = require('./routes/transaction.routes')
const budgetRoutes = require('./routes/budget.routes')
const reportRoutes = require('./routes/report.routes')
const tipRoutes = require('./routes/tip.routes')
const announcementRoutes = require('./routes/announcement.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/tips', tipRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

module.exports = app
