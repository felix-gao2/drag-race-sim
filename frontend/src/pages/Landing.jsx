import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const CAR_COUNT = 1017

function ETStrip() {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setMs(m => (m + 16) % 13800), 16)
    return () => clearInterval(id)
  }, [])
  const et = (ms / 1000).toFixed(3)
  return <>{`ET ${et}s  ·  60FT —  ·  1/8 —  ·  TRAP — MPH`}</>
}

const MONO = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`

export default function Landing() {
  const navigate = useNavigate()
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f4',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── background: asphalt floor ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45vh',
        background: '#0d0d0d', zIndex: 0, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45vh',
        background: 'radial-gradient(ellipse at 50% 100%, transparent 25%, rgba(0,0,0,0.65) 100%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* ── background: noise grain on sky ── */}
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

      {/* ── background: perspective lane lines ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="50%" y1="55%" x2="30%" y2="100%" stroke="#2a2a2a" strokeWidth="1"/>
        <line x1="50%" y1="55%" x2="70%" y2="100%" stroke="#2a2a2a" strokeWidth="1"/>
      </svg>

      {/* ── background: corner vignette ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* ── 1. top status bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px',
        borderBottom: '1px solid #1f1f1f',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.15em' }}>
          v0.1.0 // {CAR_COUNT} CARS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.15em' }}>
          SYS — READY
        </span>
      </div>

      {/* ── 2–6. center content column ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* 2. tagline */}
        <p style={{
          margin: 0,
          fontFamily: MONO, fontSize: 12, color: '#525252',
          letterSpacing: '0.3em', textTransform: 'uppercase',
        }}>
          ¼ MILE · SIDE BY SIDE · DIG START
        </p>

        {/* 3. title */}
        <h1 style={{
          margin: 0, marginTop: 32,
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: 'clamp(64px, 10vw, 160px)',
          lineHeight: 0.95,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: '#f5f5f4',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          DRAG RACE SIM
        </h1>

        {/* 4. Lottie */}
        <div style={{
          marginTop: 48,
          pointerEvents: 'none',
          flexShrink: 0,
        }}>
          <DotLottieReact
            src="/car.lottie"
            loop
            autoplay
            style={{ width: 'min(720px, 70vw)', height: 'auto' }}
          />
        </div>

        {/* 5. subtitle */}
        <p style={{
          margin: 0, marginTop: 32,
          fontFamily: MONO, fontSize: 10, color: '#525252',
          letterSpacing: '0.22em', textTransform: 'uppercase',
        }}>
          PICK TWO. RUN THE QUARTER. SEE WHO WINS.
        </p>

        {/* 6. CTA */}
        <button
          onClick={() => navigate('/race')}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            marginTop: 24,
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

      {/* ── 7. bottom telemetry strip ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        flexShrink: 0,
        background: '#060606',
        borderTop: '1px solid #131313',
        borderBottom: '1px solid #1f1f1f',
        padding: '0.45rem 1.75rem 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 10, color: '#525252', letterSpacing: '0.15em',
        }}>
          <ETStrip />
        </span>
      </div>

    </div>
  )
}
