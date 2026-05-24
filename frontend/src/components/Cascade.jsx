import { useState, useEffect, useRef } from 'react'

const MONO = `'JetBrains Mono', monospace`
const TEXT = '#F5F5F0'
const DIM  = 'rgba(245,245,240,0.35)'

const STUB = {
  AUDI:      { models: ['A4', 'A6', 'Q5', 'TT RS'],            trims: ['BASE', 'PREMIUM', 'S LINE', 'COMPETITION'] },
  BMW:       { models: ['M3', 'M4', '330I', '540I'],            trims: ['BASE', 'M SPORT', 'COMPETITION', 'XDRIVE'] },
  FORD:      { models: ['MUSTANG', 'GT500', 'F-150', 'BRONCO'], trims: ['BASE', 'GT', 'SHELBY', 'PREMIUM'] },
  CHEVROLET: { models: ['CORVETTE', 'CAMARO', 'SILVERADO', 'BLAZER'], trims: ['BASE', 'LT', 'SS', 'Z06'] },
  DODGE:     { models: ['CHALLENGER', 'CHARGER', 'DURANGO', 'VIPER'], trims: ['BASE', 'SXT', 'R/T', 'HELLCAT'] },
}

const MAKES = Object.keys(STUB)
const YEARS = Array.from({ length: 8 }, (_, i) => String(2025 - i))

function TerminalSelect({ label, value, options, disabled, onChange, accentColor }) {
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const isRed     = accentColor === '#DC2626'
  const dimBorder = isRed ? 'rgba(220,38,38,0.3)' : 'rgba(245,245,240,0.3)'
  const fullBorder= isRed ? 'rgba(220,38,38,0.9)' : 'rgba(245,245,240,0.8)'
  const active    = open || hov

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        opacity: disabled ? 0.28 : 1,
        transition: 'opacity 0.15s',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <span style={{
        fontFamily: MONO, fontSize: 10,
        color: DIM, letterSpacing: '0.22em',
        textTransform: 'uppercase',
        display: 'block', marginBottom: 6,
        userSelect: 'none',
      }}>
        {label}
      </span>

      <div
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: `1px solid ${active ? fullBorder : dimBorder}`,
          transition: 'border-color 0.12s',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{
          fontFamily: MONO, fontSize: 12,
          color: value ? TEXT : DIM,
          letterSpacing: '0.06em',
          flex: 1,
          textTransform: 'uppercase',
        }}>
          {value || '—'}
        </span>
        <span
          className={open ? 'blink' : ''}
          style={{
            fontFamily: MONO, fontSize: 12,
            color: accentColor,
            opacity: open ? 0.9 : 0.4,
          }}
        >
          _
        </span>
      </div>

      {open && options.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0, right: 0,
          background: '#060606',
          border: '0.5px solid rgba(245,245,240,0.18)',
          zIndex: 200,
          maxHeight: 180,
          overflowY: 'auto',
        }}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                padding: '9px 14px',
                fontFamily: MONO, fontSize: 11,
                color: opt === value ? accentColor : TEXT,
                cursor: 'pointer',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderBottom: i < options.length - 1
                  ? '1px solid rgba(245,245,240,0.05)'
                  : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,245,240,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Cascade({ onSelect, accentColor }) {
  const [make,  setMake]  = useState('')
  const [model, setModel] = useState('')
  const [year,  setYear]  = useState('')
  const [trim,  setTrim]  = useState('')

  const models = make ? (STUB[make]?.models ?? []) : []
  const trims  = year ? (STUB[make]?.trims  ?? []) : []

  function handleMake(v)  { setMake(v); setModel(''); setYear(''); setTrim('') }
  function handleModel(v) { setModel(v); setYear(''); setTrim('') }
  function handleYear(v)  { setYear(v); setTrim('') }
  function handleTrim(v)  { setTrim(v) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <TerminalSelect
        label="MAKE"  value={make}  options={MAKES}  disabled={false}
        onChange={handleMake}  accentColor={accentColor}
      />
      <TerminalSelect
        label="MODEL" value={model} options={models} disabled={!make}
        onChange={handleModel} accentColor={accentColor}
      />
      <TerminalSelect
        label="YEAR"  value={year}  options={YEARS}  disabled={!model}
        onChange={handleYear}  accentColor={accentColor}
      />
      <TerminalSelect
        label="TRIM"  value={trim}  options={trims}  disabled={!year}
        onChange={handleTrim}  accentColor={accentColor}
      />
    </div>
  )
}
