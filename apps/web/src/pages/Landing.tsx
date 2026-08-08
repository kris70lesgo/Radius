import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = ['Pipeline', 'Agents', 'Deploy', 'About'] as const
const BUTTON_CLASSES =
  'bg-white text-black px-8 py-3.5 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all duration-300 button-glow'
const MENU_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

function Hero() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return (
    <section className="relative h-screen w-full overflow-hidden" aria-label="Radius introduction">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/20" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12" aria-label="Main navigation">
        <a href="#top" className="font-dancing text-2xl text-white md:text-3xl" aria-label="Radius home">
          Radius
        </a>

        <div className="hidden items-center gap-12 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm tracking-wide text-white/80 transition-colors hover:text-white">
              {link}
            </a>
          ))}
        </div>

        <button type="button" className={`${BUTTON_CLASSES} hidden md:block`} onClick={() => navigate('/setup')}>
          Launch Dashboard
        </button>

        <button
          type="button"
          className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {[0, 1, 2].map((line) => {
            const transform = !isOpen
              ? 'translate3d(0, 0, 0) rotate(0deg) scale(1)'
              : line === 0
                ? 'translate3d(0, 9px, 0) rotate(45deg) scale(1)'
                : line === 1
                  ? 'translate3d(0, 0, 0) rotate(0deg) scale(0)'
                  : 'translate3d(0, -9px, 0) rotate(-45deg) scale(1)'

            return (
              <span
                key={line}
                className="block h-[2px] w-6 bg-white"
                style={{
                  opacity: isOpen && line === 1 ? 0 : 1,
                  transform,
                  transition: `transform 500ms ${MENU_EASING}, opacity 300ms ${MENU_EASING}`,
                }}
              />
            )
          })}
        </button>

        <div
          className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-500 md:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        <aside
          id="mobile-menu"
          className="fixed right-0 top-0 z-50 flex h-screen w-[85%] max-w-[340px] flex-col border-l border-white/10 bg-[#0a0608]/95 px-8 pb-10 pt-28 backdrop-blur-xl md:hidden"
          style={{
            transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
            transition: `transform 600ms ${MENU_EASING}`,
          }}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col gap-7">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-instrument text-3xl text-white"
                onClick={() => setIsOpen(false)}
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(28px, 0, 0)',
                  transition: `opacity 500ms ${MENU_EASING} ${150 + index * 75}ms, transform 500ms ${MENU_EASING} ${150 + index * 75}ms`,
                }}
              >
                {link}
              </a>
            ))}
          </div>
          <button
            type="button"
            className={`${BUTTON_CLASSES} mt-auto w-full`}
            onClick={() => navigate('/setup')}
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(28px, 0, 0)',
              transition: `opacity 500ms ${MENU_EASING} 450ms, transform 500ms ${MENU_EASING} 450ms`,
            }}
          >
            Launch Dashboard
          </button>
        </aside>
      </nav>

      <div className="absolute inset-0 flex -mt-[120px] flex-col items-center justify-center px-6">
        <h1 className="font-instrument italic text-glow text-center text-[36px] leading-[0.9] tracking-tight text-white md:text-7xl lg:text-[110px]">
          From concept to deployed SaaS.
        </h1>
        <p className="mt-5 max-w-xl text-center text-sm text-white/70 md:mt-7 md:text-base">
          AI agents that strategize, architect, and ship your SaaS — deployed to Zerops in minutes.
        </p>
        <button type="button" className={`${BUTTON_CLASSES} mt-6 md:mt-9`} onClick={() => navigate('/setup')}>
          Start Building
        </button>
      </div>

      <div className="absolute bottom-8 left-8 hidden items-center gap-3 md:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
          <span className="h-px w-3 bg-white/60" />
        </div>
        <p className="text-xs leading-[1.35] text-white/60">
          Powered by
          <br />
          AI agents
        </p>
      </div>
    </section>
  )
}

function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const rainbowRef = useRef<HTMLImageElement>(null)
  const leftCloudRef = useRef<HTMLImageElement>(null)
  const rightCloudRef = useRef<HTMLImageElement>(null)
  const rainbowY = useRef(120)
  const leftX = useRef(-200)
  const rightX = useRef(200)
  const cloudY = useRef(0)

  useEffect(() => {
    let frameId = 0
    const lerp = (current: number, target: number, factor: number) => current + (target - current) * factor

    const animate = () => {
      const section = sectionRef.current
      if (section) {
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)))
        const cloudsInView = progress >= 0.12 && progress <= 0.92

        rainbowY.current = lerp(rainbowY.current, 120 + progress * -280, 0.06)
        leftX.current = lerp(leftX.current, cloudsInView ? 0 : -200, 0.04)
        rightX.current = lerp(rightX.current, cloudsInView ? 0 : 200, 0.04)
        cloudY.current = lerp(cloudY.current, progress * -50, 0.04)

        if (rainbowRef.current) {
          rainbowRef.current.style.transform = `translate3d(0, ${rainbowY.current}px, 0)`
        }

        const opacity = Math.max(0, Math.min(1, 1 - Math.abs(leftX.current) / 200))
        if (leftCloudRef.current) {
          leftCloudRef.current.style.transform = `translate3d(${leftX.current}px, ${cloudY.current}px, 0)`
          leftCloudRef.current.style.opacity = String(opacity)
        }
        if (rightCloudRef.current) {
          rightCloudRef.current.style.transform = `translate3d(${rightX.current}px, ${cloudY.current}px, 0) scaleX(-1)`
          rightCloudRef.current.style.opacity = String(opacity)
        }
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-12"
      style={{ background: 'linear-gradient(to bottom, #010A17 0%, #0A4267 30%, #20658E 60%, #6BADC4 100%)' }}
      aria-label="Our mission"
    >
      <img
        ref={rainbowRef}
        src="https://soft-zoom-63098134.figma.site/_assets/v11/8d520a7515d06cbfc403d0125e3d05b1a7ccd29c.png"
        alt=""
        className="pointer-events-none absolute inset-x-0 top-0 z-30 w-full"
        style={{ transform: 'translate3d(0, 120px, 0)', willChange: 'transform' }}
      />
      <img
        ref={leftCloudRef}
        src="https://soft-zoom-63098134.figma.site/_assets/v11/0d6dfd3f90b930f21726f2ed56a3320d79b7a797.png"
        alt=""
        className="pointer-events-none absolute left-0 bottom-[10%] z-10 hidden w-[500px] sm:block md:w-[650px]"
        style={{ marginLeft: '-50%', opacity: 0, transform: 'translate3d(-200px, 0, 0)', willChange: 'transform' }}
      />
      <img
        ref={rightCloudRef}
        src="https://soft-zoom-63098134.figma.site/_assets/v11/0d6dfd3f90b930f21726f2ed56a3320d79b7a797.png"
        alt=""
        className="pointer-events-none absolute right-0 bottom-[15%] z-10 hidden w-[500px] sm:block md:w-[650px]"
        style={{ marginRight: '-75%', opacity: 0, transform: 'translate3d(200px, 0, 0) scaleX(-1)', willChange: 'transform' }}
      />

      <blockquote className="relative z-20 max-w-4xl text-center">
        <p className="font-instrument text-xl leading-[1.45] text-white sm:text-2xl md:text-4xl md:leading-[1.5] lg:text-[42px]">
          "Radius was built on a simple idea — that turning a SaaS concept into a deployed product shouldn't take weeks of manual work. Four specialized AI agents handle strategy, requirements, architecture, and deployment in a single pipeline. You review at each step. We handle the rest — from Prisma schema to live Zerops deployment."
        </p>
        <footer className="mt-6 text-sm tracking-wide text-white/80 md:mt-8 md:text-base">Radius — AI-Native SaaS Incubator</footer>
      </blockquote>
    </section>
  )
}

export function Landing() {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    const root = document.getElementById("root");
    if (root) root.style.overflow = "auto";
  }, [])

  return (
    <main id="top" className="bg-[#0a0608] font-inter">
      <Hero />
      <QuoteSection />
    </main>
  )
}
