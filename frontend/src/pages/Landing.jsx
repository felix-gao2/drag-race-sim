import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CAR_COUNT = 1017

function reducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── Discrete pass animation ───────────────────────────────────────────────────
// Sequence: drive 1s → trail fades 2s → stillness 4s → repeat
function useCarAnimation(rm) {
  const [driving, setDriving] = useState(false)
  const [trailOpacity, setTrailOpacity] = useState(0)
  const t = useRef(null)

  useEffect(() => {
    if (rm) return
    const pass = () => {
      setDriving(true)
      t.current = setTimeout(() => {
        setDriving(false)
        setTrailOpacity(1)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTrailOpacity(0))
        )
        t.current = setTimeout(pass, 6100) // 2s fade + 4s still + 0.1 buffer
      }, 1000)
    }
    t.current = setTimeout(pass, 800)
    return () => clearTimeout(t.current)
  }, [rm])

  return { driving, trailOpacity }
}

// ── Car SVG — top fuel dragster ───────────────────────────────────────────────
function CarSVG({ width = 140 }) {
  // viewBox: 320×60 — long narrow body, huge rear slicks, tiny front wheels
  return (
    <svg viewBox="0 0 320 60" width={width} height={Math.round(width * 60 / 320)}
      xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>

      {/* ── parachute pack (rear-left) ── */}
      <ellipse cx="8" cy="30" rx="7" ry="5" fill="#2a2a2a" />
      <rect x="8" y="28" width="10" height="4" fill="#2a2a2a" />

      {/* ── main body ── */}
      {/* low slab chassis */}
      <path d="M 16,28 L 240,24 L 260,18 L 288,16 L 304,20 L 308,26 L 308,38 L 260,38 Q 246,50 224,38 L 68,38 Q 54,50 32,38 L 16,38 Z" fill="#f5f5f4" />

      {/* ── red side stripe ── */}
      <path d="M 60,28 L 220,25 L 220,36 L 60,36 Z" fill="#dc2626" opacity="0.92" />

      {/* ── engine block bump (top-center) ── */}
      <path d="M 180,16 L 230,14 L 240,18 L 240,24 L 180,24 Z" fill="#e5e5e3" />
      {/* injector hat */}
      <rect x="195" y="9" width="30" height="8" rx="1" fill="#d4d4d2" />
      <rect x="200" y="6" width="20" height="5" rx="1" fill="#c4c4c2" />

      {/* ── exhaust pipes (top, pairs) ── */}
      <rect x="148" y="10" width="4" height="14" rx="1" fill="#1a1a1a" />
      <rect x="155" y="10" width="4" height="14" rx="1" fill="#1a1a1a" />
      <rect x="162" y="11" width="4" height="13" rx="1" fill="#1a1a1a" />
      <rect x="169" y="11" width="4" height="13" rx="1" fill="#1a1a1a" />

      {/* ── cockpit canopy ── */}
      <path d="M 256,18 L 290,16 L 303,20 L 303,26 L 256,26 Z" fill="#111" opacity="0.82" />

      {/* ── rear slick (large) ── */}
      <circle cx="46" cy="38" r="18" fill="#111" />
      <circle cx="46" cy="38" r="11" fill="#1c1c1c" />
      <circle cx="46" cy="38" r="4" fill="#2e2e2e" />
      {/* tire lettering highlight */}
      <path d="M 30,30 A 18,18 0 0 1 46,20" fill="none" stroke="#3a3a3a" strokeWidth="2.5" />

      {/* ── front wheel (small) ── */}
      <circle cx="290" cy="36" r="8" fill="#111" />
      <circle cx="290" cy="36" r="4.5" fill="#1c1c1c" />
      <circle cx="290" cy="36" r="1.8" fill="#2e2e2e" />

      {/* ── thin front nose extension ── */}
      <path d="M 304,26 L 316,26 L 318,30 L 316,34 L 304,34 Z" fill="#e8e8e6" />

      {/* ── rear brake-light ── */}
      <rect x="14" y="26" width="4" height="12" rx="1" fill="#dc2626" />
    </svg>
  )
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
  const { driving, trailOpacity } = useCarAnimation(rm)

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f4',
      overflow: 'hidden',
    }}>

      {/* ── 50vh horizon line ── */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 1, background: '#1f1f1f', zIndex: 1,
      }} />

      {/* ── red finish-line glow (center of horizon) ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.25) 0%, transparent 70%)',
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
        {/* trailing red streak — stays at 50vh after car exits */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          width: '30vw',
          height: 4,
          background: 'linear-gradient(to left, transparent, rgba(220,38,38,0.75))',
          filter: 'blur(4px)',
          opacity: trailOpacity,
          transition: 'opacity 2s linear',
          transform: 'translateY(-50%)',
        }} />

        {/* car — static center for reduced-motion, animated otherwise */}
        {rm ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            <CarSVG width={140} />
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            animation: driving ? 'carPassX 1.0s cubic-bezier(0.1, 0.8, 0.2, 1) forwards' : 'none',
            transform: driving ? undefined : 'translate(-200px, -50%)',
          }}>
            <CarSVG width={140} />
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
