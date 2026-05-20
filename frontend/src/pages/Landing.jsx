import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const CAR_COUNT = 1017
const TREE_MS   = 5000
const F = (family) => `'${family}', monospace`

function reducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── Car SVG ──────────────────────────────────────────────────────────────────
function CarSVG() {
  return (
    <svg viewBox="0 0 420 90" width="420" height="90" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
      {/* body */}
      <path d="M 30,72 L 26,58 L 26,50 L 33,44 L 56,36 L 90,22 L 128,16 L 200,14 L 246,18 L 287,34 L 342,38 L 388,50 L 396,60 L 393,72 L 338,72 Q 316,88 294,72 L 124,72 Q 102,88 80,72 Z" fill="#f5f5f4" />
      {/* racing stripe */}
      <path d="M 102,26 L 200,18 L 186,56 L 96,60 Z" fill="#dc2626" opacity="0.9" />
      {/* door seam */}
      <path d="M 130,20 L 204,18 L 188,58 L 118,60 Z" fill="none" stroke="#d4d4d2" strokeWidth="0.5" opacity="0.25" />
      {/* rear quarter window */}
      <path d="M 204,18 L 244,22 L 240,31 L 203,26 Z" fill="#111" opacity="0.78" />
      {/* windshield */}
      <path d="M 246,20 L 286,36 L 275,46 L 244,24 Z" fill="#111" opacity="0.72" />
      {/* rear wheel */}
      <circle cx="102" cy="72" r="19" fill="#111" />
      <circle cx="102" cy="72" r="11" fill="#1c1c1c" />
      <circle cx="102" cy="72" r="4.5" fill="#2e2e2e" />
      {/* front wheel */}
      <circle cx="316" cy="72" r="19" fill="#111" />
      <circle cx="316" cy="72" r="11" fill="#1c1c1c" />
      <circle cx="316" cy="72" r="4.5" fill="#2e2e2e" />
      {/* brake light — rear left */}
      <rect x="25" y="48" width="7" height="18" rx="1" fill="#dc2626" />
      <rect x="24" y="47" width="9" height="20" rx="1" fill="rgba(220,38,38,0.35)" style={{ filter: 'blur(2px)' }} />
      {/* front parking light — amber */}
      <rect x="391" y="52" width="5" height="14" rx="1" fill="#f59e0b" />
      <rect x="390" y="51" width="7" height="16" rx="1" fill="rgba(245,158,11,0.3)" style={{ filter: 'blur(2px)' }} />
    </svg>
  )
}

// ── Christmas Tree hook ───────────────────────────────────────────────────────
function useTree() {
  const [lights, setLights] = useState([false, false, false, false])
  const timers = useRef([])

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setLights([false, false, false, false])
    const after = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }
    after(() => setLights([true,  false, false, false]), 300)
    after(() => setLights([true,  true,  false, false]), 700)
    after(() => setLights([true,  true,  true,  false]), 1100)
    after(() => setLights([true,  true,  true,  true ]), 1500)
    after(() => setLights([false, false, false, false]), 2600)
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    run()
    const id = setInterval(run, TREE_MS)
    return () => { clearInterval(id); timers.current.forEach(clearTimeout) }
  }, [run])

  return { lights, run }
}

// ── Christmas Tree UI ─────────────────────────────────────────────────────────
function ChristmasTree({ lights }) {
  const cfg = [
    { on: '#f59e0b', glow: '0 0 6px #f59e0b, 0 0 16px rgba(245,158,11,0.55)' },
    { on: '#f59e0b', glow: '0 0 6px #f59e0b, 0 0 16px rgba(245,158,11,0.55)' },
    { on: '#f59e0b', glow: '0 0 6px #f59e0b, 0 0 16px rgba(245,158,11,0.55)' },
    { on: '#22c55e', glow: '0 0 8px #22c55e, 0 0 22px rgba(34,197,94,0.65)' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      {cfg.map((c, i) => (
        <div key={i} style={{
          width: 11, height: 11,
          borderRadius: '50%',
          border: '1px solid #2a2a2a',
          background: lights[i] ? c.on : '#141414',
          boxShadow: lights[i] ? c.glow : 'none',
          transition: 'background 0.07s, box-shadow 0.07s',
        }} />
      ))}
    </div>
  )
}

// ── Particle burst ────────────────────────────────────────────────────────────
function Particles({ trigger }) {
  const [pts, setPts] = useState([])
  useEffect(() => {
    if (!trigger || reducedMotion()) return
    const next = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i,
      dx: `${-(Math.random() * 48 + 8)}px`,
      dy: `${(Math.random() * 24 - 8)}px`,
      sz: Math.random() * 3 + 1.5,
    }))
    setPts(next)
    const id = setTimeout(() => setPts([]), 650)
    return () => clearTimeout(id)
  }, [trigger])

  return (
    <>
      {pts.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: 116, top: '62%',
          width: p.sz, height: p.sz,
          background: '#f5f5f4',
          borderRadius: '50%',
          animation: 'particleFly 0.55s ease-out forwards',
          '--dx': p.dx,
          '--dy': p.dy,
          pointerEvents: 'none',
        }} />
      ))}
    </>
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
const DISPLAY = `'Anton', sans-serif`

export default function Landing() {
  const navigate = useNavigate()
  const { lights, run: runTree } = useTree()
  const [particles, setParticles] = useState(0)
  const [ctaHover, setCtaHover] = useState(false)
  const rm = reducedMotion()

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f4',
      overflow: 'hidden',
    }}>

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
      <div style={{ position: 'absolute', top: '17vh', left: 0, right: 0, textAlign: 'center' }}>
        <h1 style={{
          fontFamily: DISPLAY,
          fontSize: 'clamp(64px, 9vw, 140px)',
          lineHeight: 0.95,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          margin: 0,
          userSelect: 'none',
        }}>
          <span style={{ color: '#f5f5f4' }}>DRAG </span>
          <span style={{ color: '#dc2626' }}>RACE</span>
          <span style={{ color: '#f5f5f4' }}> SIM</span>
        </h1>
      </div>

      {/* ── race track band ── */}
      <div style={{
        position: 'absolute', top: 'calc(52vh - 56px)',
        left: 0, right: 0, height: 112,
        overflow: 'hidden',
      }}>
        {/* lane 1 — faster */}
        <div className="lane-anim" style={{
          position: 'absolute', bottom: 22, left: 0, right: 0, height: 2,
          backgroundImage: 'repeating-linear-gradient(90deg, #3a3a3a 0, #3a3a3a 22px, transparent 22px, transparent 80px)',
          backgroundSize: '80px 100%',
          animation: rm ? 'none' : 'laneScroll1 1.4s linear infinite',
          opacity: 0.7,
        }} />
        {/* lane 2 — slower */}
        <div className="lane-anim" style={{
          position: 'absolute', bottom: 10, left: 0, right: 0, height: 2,
          backgroundImage: 'repeating-linear-gradient(90deg, #252525 0, #252525 16px, transparent 16px, transparent 60px)',
          backgroundSize: '60px 100%',
          animation: rm ? 'none' : 'laneScroll2 2.8s linear infinite',
          opacity: 0.45,
        }} />

        {/* car + brake trail */}
        <div
          className="car-anim"
          style={{
            position: 'absolute', top: 6, left: 0,
            display: 'flex', alignItems: 'center',
            animation: rm ? 'none' : `carDrive 6.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
            transform: rm ? 'translateX(45vw)' : undefined,
          }}
          onAnimationIteration={() => setParticles(n => n + 1)}
        >
          {/* brake-light trail */}
          <div style={{
            width: 90, height: 22,
            background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.22))',
            filter: 'blur(3px)',
            alignSelf: 'center',
            marginTop: 12,
            flexShrink: 0,
          }} />
          <CarSVG />
        </div>

        {/* particle layer */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <Particles trigger={particles} />
        </div>
      </div>

      {/* ── christmas tree — right edge ── */}
      <div style={{
        position: 'absolute', right: '1.75rem', top: '52vh',
        transform: 'translateY(-50%)', zIndex: 10,
      }}>
        <ChristmasTree lights={lights} />
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
      }}>
        <button
          onClick={() => navigate('/race')}
          onMouseEnter={() => { setCtaHover(true); runTree() }}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            fontFamily: DISPLAY,
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            background: ctaHover ? '#ef4444' : '#dc2626',
            color: '#f5f5f4',
            border: 'none',
            borderRadius: 0,
            padding: '0.875rem 3.25rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          STAGE → RUN
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
