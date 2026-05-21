import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CAR_COUNT = 1017

function reducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── Car animation: staged 2s → launch 0.7s → streak fades 1.5s → pause 3s ────
function useCarAnimation(rm) {
  const [launching, setLaunching] = useState(false)
  const [streakOpacity, setStreakOpacity] = useState(0)
  const t = useRef(null)

  useEffect(() => {
    if (rm) return
    const cycle = () => {
      setLaunching(false)
      setStreakOpacity(0)
      t.current = setTimeout(() => {
        setLaunching(true)
        setStreakOpacity(1)
        t.current = setTimeout(() => {
          setLaunching(false)
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setStreakOpacity(0))
          )
          t.current = setTimeout(cycle, 4500) // 1.5s fade + 3s pause
        }, 700)
      }, 2000)
    }
    t.current = setTimeout(cycle, 800)
    return () => clearTimeout(t.current)
  }, [rm])

  return { launching, streakOpacity }
}



// ── ET strip ──────────────────────────────────────────────────────────────────
function ETStrip() {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setMs(m => (m + 16) % 13800), 16)
    return () => clearInterval(id)
  }, [])
  const et = (ms / 1000).toFixed(3)
  return <>{`ET ${et}s  ·  60FT —  ·  1/8 —  ·  TRAP — MPH`}</>
}

// ── Landing ───────────────────────────────────────────────────────────────────
const MONO = `'JetBrains Mono', monospace`
const DISPLAY = `'Druk Wide Bold', 'PP Neue Machina', ui-sans-serif, sans-serif`

export default function Landing() {
  const navigate = useNavigate()
  const [ctaHover, setCtaHover] = useState(false)
  const rm = reducedMotion()
  const { launching, streakOpacity } = useCarAnimation(rm)

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f4',
      overflow: 'hidden',
    }}>

      {/* ── dragstrip: asphalt floor (bottom 45vh) ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45vh',
        background: '#0d0d0d', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45vh',
        background: 'radial-gradient(ellipse at 50% 100%, transparent 25%, rgba(0,0,0,0.65) 100%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* ── dragstrip: noise grain on sky ── */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '55vh', zIndex: 0, pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="skyGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#skyGrain)" opacity="0.015"/>
      </svg>

      {/* ── dragstrip: perspective lane lines converging to horizon ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="50%" y1="55%" x2="30%" y2="100%" stroke="#2a2a2a" strokeWidth="1"/>
        <line x1="50%" y1="55%" x2="70%" y2="100%" stroke="#2a2a2a" strokeWidth="1"/>
      </svg>

      {/* ── dragstrip: horizon red ambient glow ── */}
      <div style={{
        position: 'absolute',
        top: 'calc(55vh - 80px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 160,
        background: 'radial-gradient(ellipse 300px 80px at center, rgba(220,38,38,0.18) 0%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* ── corner vignette ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* ── top bar ── */}
      <div style={{
        position: 'absolute', top: '1.5rem', left: '1.75rem', right: '1.75rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#6b7280', letterSpacing: '0.15em' }}>
          v0.1.0 // {CAR_COUNT} CARS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#404040', letterSpacing: '0.15em' }}>
          SYS — READY
        </span>
      </div>

      {/* ── kicker ── */}
      <div style={{ position: 'absolute', top: '10vh', left: 0, right: 0, textAlign: 'center' }}>
        <p style={{
          fontFamily: MONO, fontSize: 11, color: '#6b7280',
          letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0,
        }}>
          ¼ MILE · SIDE BY SIDE · DIG START
        </p>
      </div>

      {/* ── title ── */}
      <div style={{
        position: 'absolute', top: '30vh', left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        transform: 'translateY(-1em)',
      }}>
        <h1 style={{
          fontFamily: DISPLAY,
          fontSize: 'clamp(72px, 9vw, 140px)',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          margin: 0,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          maxWidth: 1100,
          color: '#dc2626',
        }}>
          DRAG RACE SIM
        </h1>
      </div>

      {/* ── car pass layer ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* 80vw red streak, lingers after launch */}
        <div style={{
          position: 'absolute',
          top: 'calc(60vh - 24px)',
          left: 0,
          width: '80vw',
          height: 8,
          transform: 'translateX(18vw)',
          background: 'linear-gradient(to right, transparent 0%, rgba(220,38,38,0.9) 100%)',
          filter: 'blur(6px)',
          opacity: streakOpacity,
          transition: launching ? 'none' : 'opacity 1.5s linear',
        }} />

        {/* car — static center for reduced-motion, animated otherwise */}
        {rm ? (
          <div style={{
            position: 'absolute',
            top: '60vh',
            left: '50%',
            transform: 'translateX(-50%) translateY(-100%)',
          }}>
            <img
              src="/Ford-GT.png"
              alt="Ford GT"
              width={440}
              style={{
                display: 'block',
                mixBlendMode: 'multiply',
                filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.7)) drop-shadow(-1px 0 0 rgba(245,245,244,0.25)) drop-shadow(0 -1px 0 rgba(245,245,244,0.15))',
              }}
            />
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: '60vh',
            left: 0,
            animation: launching ? 'carLaunch 0.7s cubic-bezier(0.5,0,0.75,0) forwards' : 'none',
            transform: launching ? undefined : 'translateX(18vw) translateY(-100%)',
          }}>
            <img
              src="/Ford-GT.png"
              alt="Ford GT"
              width={440}
              style={{
                display: 'block',
                mixBlendMode: 'multiply',
                filter: launching
                  ? 'blur(1.5px) drop-shadow(0 12px 20px rgba(0,0,0,0.7)) drop-shadow(-2px 0 8px rgba(220,38,38,0.4))'
                  : 'drop-shadow(0 12px 20px rgba(0,0,0,0.7)) drop-shadow(-1px 0 0 rgba(245,245,244,0.25)) drop-shadow(0 -1px 0 rgba(245,245,244,0.15))',
              }}
            />
          </div>
        )}
      </div>

      {/* ── tagline ── */}
      <div style={{ position: 'absolute', top: '82vh', left: 0, right: 0, textAlign: 'center' }}>
        <p style={{
          fontFamily: MONO, fontSize: 10, color: '#737373',
          letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0,
        }}>
          PICK TWO. RUN THE QUARTER. SEE WHO WINS.
        </p>
      </div>

      {/* ── CTA ── */}
      <div style={{
        position: 'absolute', top: '90vh', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)',
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/race')}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            background: ctaHover ? '#ef4444' : '#dc2626',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: 0,
            padding: '12px 28px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background 0.15s, transform 0.15s',
            transform: ctaHover ? 'scale(1.02)' : 'scale(1)',
            animation: ctaHover ? 'none' : 'ctaPulse 2.4s ease-in-out infinite',
          }}
        >
          START RACING
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0" y="0" width="4" height="4" fill="#0a0a0a"/>
            <rect x="4" y="0" width="4" height="4" fill="white"/>
            <rect x="8" y="0" width="4" height="4" fill="#0a0a0a"/>
            <rect x="12" y="0" width="4" height="4" fill="white"/>
            <rect x="0" y="4" width="4" height="4" fill="white"/>
            <rect x="4" y="4" width="4" height="4" fill="#0a0a0a"/>
            <rect x="8" y="4" width="4" height="4" fill="white"/>
            <rect x="12" y="4" width="4" height="4" fill="#0a0a0a"/>
            <rect x="0" y="8" width="4" height="4" fill="#0a0a0a"/>
            <rect x="4" y="8" width="4" height="4" fill="white"/>
            <rect x="8" y="8" width="4" height="4" fill="#0a0a0a"/>
            <rect x="12" y="8" width="4" height="4" fill="white"/>
            <rect x="0" y="12" width="4" height="4" fill="white"/>
            <rect x="4" y="12" width="4" height="4" fill="#0a0a0a"/>
            <rect x="8" y="12" width="4" height="4" fill="white"/>
            <rect x="12" y="12" width="4" height="4" fill="#0a0a0a"/>
          </svg>
        </button>
      </div>

      {/* ── telemetry strip ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#060606',
        borderTop: '1px solid #131313',
        padding: '0.45rem 1.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 10, color: '#404040', letterSpacing: '0.15em',
        }}>
          <ETStrip />
        </span>
      </div>
    </div>
  )
}
