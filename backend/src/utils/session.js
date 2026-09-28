const crypto = require('crypto')
const prisma = require('../config/prisma')

const IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000 // expire after 24h of no activity
const ABSOLUTE_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000 // hard cap even if continuously active
const REFRESH_THROTTLE_MS = 5 * 60 * 1000 // avoid writing on every single request

function hashSessionToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

async function createSession(userId, userAgent) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashSessionToken(rawToken)
  const now = new Date()

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      userAgent: userAgent ? userAgent.slice(0, 255) : null,
      expiresAt: new Date(now.getTime() + IDLE_TIMEOUT_MS),
      lastUsedAt: now,
    },
  })

  return rawToken
}

// Verifies a raw session token, enforcing idle expiry and an absolute lifetime cap.
// Slides the idle window forward on valid use (throttled to limit DB writes).
// Returns the session's user, or null if the token is missing/invalid/expired.
async function verifySession(rawToken) {
  if (!rawToken) return null

  const tokenHash = hashSessionToken(rawToken)
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })
  if (!session) return null

  const now = new Date()
  const idleExpired = now > session.expiresAt
  const absoluteExpired = now.getTime() - session.createdAt.getTime() > ABSOLUTE_TIMEOUT_MS

  if (idleExpired || absoluteExpired) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    return null
  }

  const sinceLastRefresh = now.getTime() - session.lastUsedAt.getTime()
  if (sinceLastRefresh > REFRESH_THROTTLE_MS) {
    await prisma.session
      .update({
        where: { id: session.id },
        data: { lastUsedAt: now, expiresAt: new Date(now.getTime() + IDLE_TIMEOUT_MS) },
      })
      .catch(() => {})
  }

  return session.user
}

async function revokeSession(rawToken) {
  if (!rawToken) return
  const tokenHash = hashSessionToken(rawToken)
  await prisma.session.deleteMany({ where: { tokenHash } })
}

module.exports = { createSession, verifySession, revokeSession }
