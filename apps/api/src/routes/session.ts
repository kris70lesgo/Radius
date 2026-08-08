import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

// Augment express-session with our session shape
declare module 'express-session' {
  interface SessionData {
    mode?: 'github' | 'demo' | null
    githubUser?: {
      id: number
      username: string
      avatar: string
    }
    githubAccessToken?: string
  }
}

// GET /api/session — return current session state
router.get(
  '/session',
  asyncHandler(async (_req, res) => {
    const session = _req.session

    if (!session || !session.mode) {
      res.json({ mode: null })
      return
    }

    if (session.mode === 'github' && session.githubUser) {
      res.json({
        mode: 'github',
        githubUser: session.githubUser,
      })
      return
    }

    if (session.mode === 'demo') {
      res.json({ mode: 'demo' })
      return
    }

    res.json({ mode: null })
  }),
)

// POST /api/demo — mark current session as demo mode
router.post(
  '/demo',
  asyncHandler(async (req, res) => {
    if (!req.session) {
      res.status(500).json({ error: 'Session not available' })
      return
    }

    req.session.mode = 'demo'
    req.session.githubUser = undefined
    req.session.githubAccessToken = undefined

    res.json({ mode: 'demo' })
  }),
)

// POST /api/session/logout — clear the session
router.post(
  '/session/logout',
  asyncHandler(async (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to destroy session' })
        return
      }
      res.clearCookie('radius-session')
      res.json({ mode: null })
    })
  }),
)

export { router as sessionRouter }
