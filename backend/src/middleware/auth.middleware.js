const { verifySession } = require('../utils/session')

async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const rawToken = header.slice('Bearer '.length)
  const user = await verifySession(rawToken)
  if (!user) {
    return res.status(401).json({ message: 'Session expired or invalid, please log in again' })
  }
  if (user.isDisabled) {
    return res.status(403).json({ message: 'This account has been disabled' })
  }

  req.user = { id: user.id, role: user.role }
  req.sessionToken = rawToken
  next()
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = { requireAuth, requireAdmin }
