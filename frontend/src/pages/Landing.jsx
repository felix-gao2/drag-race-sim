import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const CAR_COUNT = 1017

const RESET = { ms: 0, ft60: null, eighth: null, trap: null }

function ETStrip() {
  const [s, setS] = useState(RESET)

  useEffect(() => {
    const id = setInterval(() => {
      setS(prev => {
        const ms = prev.ms + 80
        if (ms >= 10000) return RESET
        const et = ms / 1000
        return {
          ms,
          ft60:   prev.ft60   ?? (et >= 1.2 ? (1.15 + Math.random() * 0.30).toFixed(3) : null),
          eighth: prev.eighth ?? (et >= 5.5 ? (5.40 + Math.random() * 0.40).toFixed(3) : null),
          trap:   prev.trap   ?? (et >= 9.0 ? (145  + Math.random() * 20  ).toFixed(1) : null),
        }
      })
    }, 80)
    return () => clearInterval(id)
  }, [])

  const et = (s.ms / 1000).toFixed(3)
  const Y = ({ v }) => v === '—'
    ? <span>{v}</span>
    : <span style={{ color: '#facc15' }}>{v}</span>
  return <>
    ET <Y v={`${et}s`} />
    {'  ·  '}
    60FT <Y v={s.ft60 ?? '—'} />
    {'  ·  '}
    1/8 <Y v={s.eighth ?? '—'} />
    {'  ·  '}
    TRAP <Y v={s.trap ?? '—'} /> MPH
  </>
}

const MONO = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`

export default function Landing() {
  const navigate = useNavigate()
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <div className="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f4',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateRows: 'auto 1fr 1fr 1fr auto',
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
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          v0.1.0 // {CAR_COUNT} CARS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          ¼ MILE · SIDE BY SIDE · DIG START
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0, animation: 'sysBlink 1.6s ease-in-out infinite' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            SYS — READY
          </span>
        </span>
      </div>

      {/* ── row 1: title ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'baseline' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(250,204,21,0.3)', marginRight: 16 }} />
          <h1 className="title" style={{
            margin: 0,
            flexShrink: 0,
            fontFamily: DISPLAY,
            fontWeight: 400,
            fontSize: 'clamp(64px, 10vw, 160px)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            textShadow: '0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.8), 0 0 40px rgba(250,204,21,0.15)',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}>
            DRAG RACE SIM
          </h1>
          <div style={{ flex: 1, height: 1, background: 'rgba(250,204,21,0.3)', marginLeft: 16 }} />
        </div>
      </div>

      {/* ── row 2: lottie ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ pointerEvents: 'none' }}>
          <DotLottieReact
            src="/car.lottie"
            loop
            autoplay
            style={{ width: 'min(720px, 70vw)', height: 'auto' }}
          />
        </div>
      </div>

      {/* ── row 3: subtitle + CTA ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 24,
      }}>
        <p style={{
          margin: 0,
          fontFamily: MONO, fontSize: 14, color: '#a3a3a3',
          letterSpacing: '0.25em', textTransform: 'uppercase',
        }}>
          PICK TWO. RUN THE QUARTER. SEE WHO WINS.
        </p>
        <button
          onClick={() => navigate('/race')}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            fontFamily: MONO,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            background: ctaHover ? '#ef4444' : '#dc2626',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: 0,
            padding: '18px 48px',
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

      {/* ── 6. bottom telemetry strip ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#060606',
        borderTop: '1px solid #131313',
        borderBottom: '1px solid #1f1f1f',
        padding: '0.45rem 1.75rem 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em',
        }}>
          <ETStrip />
        </span>
      </div>

    </div>
  )
}
