import { useState, useEffect, useRef } from 'react'

const MONO = `'JetBrains Mono', monospace`
const TEXT = '#F5F5F0'
const DIM  = 'rgba(245,245,240,0.35)'

const STUB = {
  AUDI: {
    'A4':    { hp: 201, torque: 236, weight: 3637, drivetrain: 'AWD', trims: ['BASE', 'PREMIUM', 'S LINE', 'COMPETITION'] },
    'A6':    { hp: 335, torque: 369, weight: 4266, drivetrain: 'AWD', trims: ['BASE', 'PREMIUM', 'S LINE', 'COMPETITION'] },
    'Q5':    { hp: 261, torque: 273, weight: 4045, drivetrain: 'AWD', trims: ['BASE', 'PREMIUM', 'S LINE', 'COMPETITION'] },
    'TT RS': { hp: 394, torque: 354, weight: 3571, drivetrain: 'AWD', trims: ['BASE', 'PREMIUM', 'COMPETITION'] },
  },
  BMW: {
    'M3':   { hp: 503, torque: 479, weight: 3795, drivetrain: 'RWD', trims: ['BASE', 'COMPETITION', 'M SPORT', 'XDRIVE'] },
    'M4':   { hp: 503, torque: 479, weight: 3748, drivetrain: 'RWD', trims: ['BASE', 'COMPETITION', 'M SPORT', 'XDRIVE'] },
    '330I': { hp: 255, torque: 295, weight: 3582, drivetrain: 'RWD', trims: ['BASE', 'M SPORT', 'XDRIVE'] },
    '540I': { hp: 335, torque: 332, weight: 3924, drivetrain: 'RWD', trims: ['BASE', 'M SPORT', 'XDRIVE'] },
  },
  FORD: {
    'MUSTANG': { hp: 450, torque: 410, weight: 3837, drivetrain: 'RWD', trims: ['BASE', 'GT', 'PREMIUM', 'MACH 1'] },
    'GT500':   { hp: 760, torque: 625, weight: 4225, drivetrain: 'RWD', trims: ['BASE', 'CARBON', 'SHELBY'] },
    'F-150':   { hp: 400, torque: 500, weight: 5150, drivetrain: '4WD', trims: ['BASE', 'XLT', 'PLATINUM', 'RAPTOR'] },
    'BRONCO':  { hp: 300, torque: 325, weight: 4688, drivetrain: '4WD', trims: ['BASE', 'BIG BEND', 'BADLANDS', 'WILDTRAK'] },
  },
  CHEVROLET: {
    'CORVETTE':  { hp: 495, torque: 470, weight: 3366, drivetrain: 'RWD', trims: ['BASE', '1LT', '2LT', '3LT'] },
    'CAMARO':    { hp: 455, torque: 455, weight: 3950, drivetrain: 'RWD', trims: ['BASE', 'LT', 'SS', 'ZL1'] },
    'SILVERADO': { hp: 420, torque: 460, weight: 4770, drivetrain: '4WD', trims: ['BASE', 'LT', 'LTZ', 'HIGH COUNTRY'] },
    'BLAZER':    { hp: 314, torque: 269, weight: 4353, drivetrain: 'AWD', trims: ['BASE', 'LT', 'RS', 'SS'] },
  },
  DODGE: {
    'CHALLENGER': { hp: 717, torque: 656, weight: 4448, drivetrain: 'RWD', trims: ['SXT', 'R/T', 'SCAT PACK', 'HELLCAT'] },
    'CHARGER':    { hp: 717, torque: 656, weight: 4586, drivetrain: 'RWD', trims: ['SXT', 'R/T', 'SCAT PACK', 'HELLCAT'] },
    'DURANGO':    { hp: 710, torque: 645, weight: 5360, drivetrain: 'AWD', trims: ['SXT', 'GT', 'R/T', 'HELLCAT'] },
    'VIPER':      { hp: 645, torque: 600, weight: 3374, drivetrain: 'RWD', trims: ['BASE', 'GTS', 'ACR', 'TA 2.0'] },
  },
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

  const models = make        ? Object.keys(STUB[make] ?? {})     : []
  const trims  = make&&model ? (STUB[make]?.[model]?.trims ?? []) : []

  function handleMake(v)  { setMake(v); setModel(''); setYear(''); setTrim('') }
  function handleModel(v) { setModel(v); setYear(''); setTrim('') }
  function handleYear(v)  { setYear(v); setTrim('') }
  function handleTrim(v)  { setTrim(v) }

  useEffect(() => {
    if (!make || !model || !year || !trim) return
    const spec = STUB[make]?.[model]
    if (!spec) return
    onSelect({ make, model, year, trim, hp: spec.hp, torque: spec.torque, weight: spec.weight, drivetrain: spec.drivetrain })
  }, [make, model, year, trim])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <TerminalSelect label="MAKE"  value={make}  options={MAKES}  disabled={false}  onChange={handleMake}  accentColor={accentColor} />
      <TerminalSelect label="MODEL" value={model} options={models} disabled={!make}  onChange={handleModel} accentColor={accentColor} />
      <TerminalSelect label="YEAR"  value={year}  options={YEARS}  disabled={!model} onChange={handleYear}  accentColor={accentColor} />
      <TerminalSelect label="TRIM"  value={trim}  options={trims}  disabled={!year}  onChange={handleTrim}  accentColor={accentColor} />
    </div>
  )
}
