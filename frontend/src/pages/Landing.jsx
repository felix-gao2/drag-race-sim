import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MONO = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT = '#F5F5F0'
const DIM = 'rgba(245,245,240,0.4)'
const ACCENT = '#DC2626'

export default function Landing() {
  const navigate = useNavigate()
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000000',
      color: TEXT,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* subtle radial vignette, max 5% */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.05) 100%)',
      }} />

      {/* ── top HUD bar ── */}
      <div style={{
        height: 32,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          V0.1.0 // 1017 CARS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          ¼ MILE · SIDE BY SIDE · DIG START
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: ACCENT, fontSize: 8, lineHeight: 1 }}>●</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            SYS — READY
          </span>
        </span>
      </div>

      {/* ── hero image ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <img
          src="/hero.jpg"
          alt=""
          style={{
            width: '55vw',
            maxWidth: 800,
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* ── headline ── */}
      <div style={{
        flexShrink: 0,
        textAlign: 'center',
        paddingTop: 32,
        position: 'relative',
        zIndex: 10,
      }}>
        <h1 style={{
          margin: 0,
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: 'clamp(72px, 9vw, 120px)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          color: TEXT,
          userSelect: 'none',
        }}>
          QUARTER MILE
        </h1>
      </div>

      {/* ── CTA ── */}
      <div style={{
        flexShrink: 0,
        textAlign: 'center',
        paddingTop: 24,
        position: 'relative',
        zIndex: 10,
      }}>
        <span
          role="button"
          tabIndex={0}
          onClick={() => navigate('/race')}
          onKeyDown={e => e.key === 'Enter' && navigate('/race')}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: ctaHover ? ACCENT : TEXT,
            cursor: 'pointer',
            userSelect: 'none',
            outline: 'none',
            transition: 'color 0.1s',
          }}
        >
          {'> SELECT CONTENDERS'}
          <span className="blink-caret" style={{ color: ACCENT }}>_</span>
        </span>
      </div>

      {/* ── bottom HUD bar ── */}
      <div style={{
        height: 32,
        flexShrink: 0,
        marginTop: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 11,
          color: DIM,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          whiteSpace: 'pre',
        }}>
          {'ET —   ·   60FT —   ·   1/8 —   ·   TRAP — MPH'}
        </span>
      </div>
    </div>
  )
}
