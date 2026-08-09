import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'
const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? ''

// GET /api/github/login — redirect to GitHub OAuth authorize page
router.get('/login', (req, res) => {
  if (!CLIENT_ID) {
    res.status(500).json({
      error: 'GITHUB_CLIENT_ID is not configured. Create a GitHub OAuth App and set the env vars.',
    })
    return
  }

  // Determine the correct protocol. Zerops terminates TLS at the L7 balancer
  // and may not send X-Forwarded-Proto, so we check multiple signals:
  //   1. X-Forwarded-Proto header (standard reverse-proxy header)
  //   2. req.secure (true if the socket is TLS — won't be behind a proxy)
  //   3. Fall back to https for production (NODE_ENV=production)
  const forwardedProto = req.get('x-forwarded-proto')
  const isHttps =
    forwardedProto === 'https' ||
    req.secure ||
    process.env.NODE_ENV === 'production'
  const proto = isHttps ? 'https' : 'http'
  const host = req.get('host')
  const redirectUri = `${proto}://${host}/api/auth/github/callback`
  const scope = 'repo user'
  const state = Math.random().toString(36).substring(2, 10)

  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`

  res.redirect(authUrl)
})

// GET /api/github/callback — handle OAuth callback from GitHub
router.get(
  '/callback',
  asyncHandler(async (req, res) => {
    const { code, error } = req.query

    if (error) {
      res.redirect(`${FRONTEND_URL}/setup?error=oauth_denied`)
      return
    }

    if (!code || typeof code !== 'string') {
      res.redirect(`${FRONTEND_URL}/setup?error=missing_code`)
      return
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      res.redirect(`${FRONTEND_URL}/setup?error=oauth_not_configured`)
      return
    }

    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    })

    if (!tokenRes.ok) {
      res.redirect(`${FRONTEND_URL}/setup?error=token_exchange_failed`)
      return
    }

    const tokenData = (await tokenRes.json()) as {
      access_token?: string
      error?: string
      error_description?: string
    }

    if (!tokenData.access_token) {
      res.redirect(`${FRONTEND_URL}/setup?error=no_access_token`)
      return
    }

    const accessToken = tokenData.access_token

    // Fetch user profile from GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!userRes.ok) {
      res.redirect(`${FRONTEND_URL}/setup?error=user_fetch_failed`)
      return
    }

    const user = (await userRes.json()) as {
      id: number
      login: string
      avatar_url: string
    }

    // Store in session — token stays server-side, never sent to frontend
    if (req.session) {
      req.session.mode = 'github'
      req.session.githubAccessToken = accessToken
      req.session.githubUser = {
        id: user.id,
        username: user.login,
        avatar: user.avatar_url,
      }
    }

    res.redirect(`${FRONTEND_URL}/setup?auth=success`)
  }),
)

// GET /api/github/status — check if GitHub is connected in session
router.get(
  '/status',
  asyncHandler(async (req, res) => {
    if (req.session?.mode === 'github' && req.session.githubUser) {
      res.json({
        connected: true,
        user: req.session.githubUser,
      })
      return
    }

    res.json({ connected: false })
  }),
)

export { router as githubRouter }
