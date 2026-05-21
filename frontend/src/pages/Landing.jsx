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

// ── Car SVG — top fuel dragster (detailed side profile) ──────────────────────
function DragsterSVG({ width = 280 }) {
  const h = Math.round(width * 170 / 560)
  // viewBox 560×170 → rendered 280×85. Scale: 0.5px per unit.
  // Ground line at y=163. Rear slick r=80 (80px diam). Front wheel r=24 (24px diam).
  return (
    <svg viewBox="0 0 560 170" width={width} height={h}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}>

      {/* ground contact shadow */}
      <ellipse cx="285" cy="164" rx="230" ry="5" fill="rgba(0,0,0,0.38)" />

      {/* ── rear slick (80px diam rendered) ── */}
      <circle cx="115" cy="83" r="80" fill="#111" />
      <circle cx="115" cy="83" r="56" fill="#161616" />
      <circle cx="115" cy="83" r="28" fill="#1e1e1e" />
      <circle cx="115" cy="83" r="11" fill="#252525" />
      <path d="M 50,52 A 80,80 0 0,1 96,13" fill="none" stroke="#2c2c2c" strokeWidth="5" strokeLinecap="round"/>
      <path d="M 36,105 A 80,80 0 0,1 37,63" fill="none" stroke="#2c2c2c" strokeWidth="5" strokeLinecap="round"/>

      {/* ── rear wing / spoiler ── */}
      <path d="M 58,71 L 188,64 L 188,54 L 58,61 Z" fill="#d4d4d4" />
      <rect x="57" y="61" width="7" height="22" rx="1" fill="#c4c4c4" />
      <rect x="188" y="54" width="7" height="22" rx="1" fill="#c4c4c4" />
      <line x1="80" y1="61" x2="88" y2="100" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="168" y1="57" x2="175" y2="99" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── main body / chassis slab ── */}
      <path d="
        M 70,100 L 202,93 L 282,90 L 385,87 L 458,89 L 515,96 L 548,103 L 556,107 L 558,109 L 556,112
        L 550,115 L 515,117 L 458,119 L 385,121 L 282,123 L 202,125 L 70,128
        Q 62,128 58,120 L 58,108 Q 62,100 70,100 Z
      " fill="#f5f5f4" />

      {/* ── red stripe full length ── */}
      <path d="
        M 70,115 L 202,110 L 282,108 L 385,106 L 458,107 L 515,111 L 548,113 L 550,116
        L 515,118 L 458,120 L 385,122 L 282,124 L 202,126 L 70,128 Z
      " fill="#dc2626" />

      {/* ── engine block under blower ── */}
      <path d="M 265,90 L 390,85 L 398,92 L 398,112 L 265,115 Z" fill="#e0e0de" />

      {/* ── supercharger / blower ── */}
      <rect x="278" y="66" width="105" height="26" rx="3" fill="#d0d0ce" />
      <rect x="288" y="56" width="85" height="14" rx="2" fill="#c8c8c6" />
      {/* injector stacks */}
      {[293, 305, 317, 329, 341, 353, 365].map((x, i) => (
        <rect key={i} x={x} y="45" width="7" height="14" rx="1" fill="#1c1c1c" />
      ))}
      {/* blower ribbing */}
      {[291, 303, 315, 327, 339, 351, 363, 375].map((x, i) => (
        <line key={i} x1={x} y1="66" x2={x} y2="92" stroke="#bbb" strokeWidth="0.75" />
      ))}

      {/* ── zoomie exhaust headers (4 pipes, angle up-rearward) ── */}
      {[0, 10, 20, 30].map((off, i) => (
        <path key={i}
          d={`M ${260 + off},113 Q ${248 + off},97 ${234 + off},80`}
          fill="none" stroke="#1e1e1e" strokeWidth="6" strokeLinecap="round"
        />
      ))}

      {/* ── open cockpit / exposed roll cage ── */}
      <path d="M 422,100 Q 422,72 440,69 Q 458,66 462,100"
        fill="none" stroke="#3a3a3a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="424" y1="87" x2="460" y2="85" stroke="#3a3a3a" strokeWidth="2.5"/>
      {/* windscreen / head fairing */}
      <path d="M 462,69 L 492,80 L 488,100 L 462,100 Z" fill="#111" opacity="0.78"/>
      {/* driver helmet */}
      <ellipse cx="443" cy="89" rx="13" ry="12" fill="#222" />
      <path d="M 431,85 Q 443,75 455,85" fill="none" stroke="#3a3a3a" strokeWidth="2"/>

      {/* ── needle nose cone (extends past front wheel) ── */}
      <path d="M 513,97 L 558,107 L 558,113 L 513,118 Z" fill="#e8e8e6"/>
      <line x1="513" y1="109" x2="557" y2="110" stroke="#dc2626" strokeWidth="1.5" opacity="0.5"/>

      {/* ── front stub axle ── */}
      <line x1="478" y1="116" x2="491" y2="127" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── front wheel (24px diam rendered) ── */}
      <circle cx="491" cy="139" r="24" fill="#111" />
      <circle cx="491" cy="139" r="15" fill="#1c1c1c" />
      <circle cx="491" cy="139" r="6" fill="#222" />
      <circle cx="491" cy="139" r="2.5" fill="#2d2d2d" />

      {/* ── parachute packs ── */}
      <ellipse cx="38" cy="113" rx="22" ry="12" fill="#262626" />
      <rect x="38" y="104" width="27" height="18" rx="3" fill="#262626" />
      <line x1="48" y1="105" x2="64" y2="110" stroke="#333" strokeWidth="1.5"/>
      <line x1="48" y1="121" x2="64" y2="117" stroke="#333" strokeWidth="1.5"/>

      {/* ── rear brake light ── */}
      <rect x="60" y="117" width="5" height="9" rx="1" fill="#dc2626" />
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
        width: 300,
        height: 160,
        background: 'radial-gradient(ellipse 150px 80px at center, rgba(220,38,38,0.18) 0%, transparent 100%)',
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
        {/* 60vw red streak, lingers after launch */}
        <div style={{
          position: 'absolute',
          top: 'calc(60vh - 24px)',
          left: 0,
          width: '60vw',
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
            <DragsterSVG width={280} />
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: '60vh',
            left: 0,
            animation: launching ? 'carLaunch 0.7s cubic-bezier(0.5,0,0.75,0) forwards' : 'none',
            transform: launching ? undefined : 'translateX(18vw) translateY(-100%)',
          }}>
            <DragsterSVG width={280} />
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
