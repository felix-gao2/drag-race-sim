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
      {/* ── fixed background structure ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>

        {/* 40×40 grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(245,245,240,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(245,245,240,0.04) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '40px 40px',
        }} />

        {/* center staging dashed line */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,245,240,0.05) 0, rgba(245,245,240,0.05) 4px, transparent 4px, transparent 12px)',
        }} />

        {/* left lane marker — vertical line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        {/* left lane marker — ticks every 120px */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />

        {/* right lane marker — vertical line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        {/* right lane marker — ticks every 120px */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />

        {/* corner brackets */}
        <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '1px solid rgba(220,38,38,0.6)', borderLeft: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '1px solid rgba(220,38,38,0.6)', borderRight: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '1px solid rgba(220,38,38,0.6)', borderLeft: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '1px solid rgba(220,38,38,0.6)', borderRight: '1px solid rgba(220,38,38,0.6)' }} />

      </div>

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
            width: '70vw',
            maxWidth: 1000,
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 92%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 92%)',
          }}
        />
      </div>

      {/* ── headline ── */}
      <div style={{
        flexShrink: 0,
        textAlign: 'center',
        paddingTop: 16,
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
          QUARTER MILE SIM
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
