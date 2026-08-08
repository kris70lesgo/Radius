import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ShaderBackground } from "../components/ui/shader-b3e94fd7"

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="#1a1a2e"
    >
      <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
    </svg>
  )
}

type SessionInfo =
  | { mode: "github"; githubUser: { id: number; username: string; avatar: string } }
  | { mode: "demo" }
  | { mode: null }

export function Setup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)

  // Check existing session on mount — redirect to dashboard if already connected
  useEffect(() => {
    const authSuccess = searchParams.get("auth") === "success"
    const oauthError = searchParams.get("error")

    if (oauthError) {
      const messages: Record<string, string> = {
        oauth_denied: "GitHub authorization was denied.",
        missing_code: "No authorization code received from GitHub.",
        oauth_not_configured:
          "GitHub OAuth is not configured on the server. Set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET.",
        token_exchange_failed: "Failed to exchange code for access token.",
        no_access_token: "GitHub did not return an access token.",
        user_fetch_failed: "Failed to fetch GitHub user profile.",
      }
      setError(messages[oauthError] ?? "An error occurred during authentication.")
    }

    async function checkSession() {
      try {
        const res = await fetch(`${API_BASE}/api/session`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to check session")
        const data: SessionInfo = await res.json()

        if (data.mode === "github" || data.mode === "demo" || authSuccess) {
          navigate("/dashboard", { replace: true })
          return
        }
      } catch {
        // No session — show setup page
      }
      setChecking(false)
    }

    checkSession()
  }, [navigate, searchParams])

  const handleGithubConnect = () => {
    window.location.href = `${API_BASE}/api/auth/github/login`
  }

  const handleDemo = async () => {
    setDemoLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/demo`, {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to start demo")
      navigate("/dashboard", { replace: true })
    } catch {
      setError("Failed to start demo mode. Please try again.")
      setDemoLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0608]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Shader background — behind all content */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground className="h-full w-full" />
      </div>

      {/* Foreground content — centered, narrow */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5">
        <div
          className="flex w-full max-w-[420px] flex-col items-center"
          style={{ gap: "0px" }}
        >
          {/* Heading */}
          <h1
            className="font-sans text-center font-medium text-white"
            style={{ fontSize: "22px", lineHeight: 1.3 }}
          >
            connect with github:
          </h1>

          {/* GitHub connect button */}
          <button
            type="button"
            onClick={handleGithubConnect}
            className="mt-5 flex items-center justify-center bg-white px-5 transition-colors duration-200 hover:bg-white/90"
            style={{
              width: "100%",
              maxWidth: "360px",
              height: "50px",
              borderRadius: "10px",
              border: "1px solid #e5e5e5",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
            aria-label="Connect with GitHub"
          >
            <GithubIcon size={24} />
            <span
              className="font-sans font-semibold text-[#1a1a2e]"
              style={{ fontSize: "15px", marginLeft: "10px" }}
            >
              Connect with GitHub
            </span>
          </button>

          {/* Separator */}
          <p
            className="font-sans text-center text-white/70"
            style={{ fontSize: "18px", marginTop: "40px", marginBottom: "16px" }}
          >
            or
          </p>

          {/* Demo text */}
          <p
            className="font-sans text-center text-white"
            style={{ fontSize: "20px", marginBottom: "28px" }}
          >
            use demo
          </p>

          {/* Get started button */}
          <button
            type="button"
            onClick={handleDemo}
            disabled={demoLoading}
            className="flex items-center justify-center bg-[#7C3AED] text-white transition-colors duration-200 hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              width: "100%",
              maxWidth: "380px",
              height: "44px",
              borderRadius: "8px",
              border: "1px solid #5B21B6",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              cursor: "pointer",
            }}
            aria-label="Get started with demo"
          >
            {demoLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <span className="font-sans font-semibold" style={{ fontSize: "15px" }}>
                Get started
              </span>
            )}
          </button>

          {/* Error message */}
          {error && (
            <p
              className="mt-6 max-w-[360px] text-center text-sm font-sans"
              style={{ color: "#F87171" }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
