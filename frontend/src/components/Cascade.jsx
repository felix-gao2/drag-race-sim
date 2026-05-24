import { useState, useEffect } from 'react'
import { getMakes, getModels, getYears, getTrims } from '../api'

const MONO = `'JetBrains Mono', monospace`

const BASE_BORDER  = '#2a2a2a'
const FOCUS_BORDER = '#DC2626'

function Dropdown({ label, value, options, disabled, onChange, renderOption }) {
  function handleMouseEnter(e) {
    if (!disabled) e.target.style.borderColor = FOCUS_BORDER
  }
  function handleMouseLeave(e) {
    if (!disabled && document.activeElement !== e.target)
      e.target.style.borderColor = BASE_BORDER
  }
  function handleFocus(e) {
    if (!disabled) {
      e.target.style.borderColor = FOCUS_BORDER
      e.target.style.boxShadow = '0 0 0 1px rgba(220,38,38,0.2)'
    }
  }
  function handleBlur(e) {
    e.target.style.borderColor = BASE_BORDER
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{ opacity: disabled ? 0.35 : 1, display: 'flex', flexDirection: 'column' }}>
      <span style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(245,245,240,0.4)',
        marginBottom: 6,
        display: 'block',
      }}>
        {label}
      </span>

      <div style={{ position: 'relative' }}>
        <select
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            width: '100%',
            background: '#000000',
            color: '#F5F5F0',
            border: `1px solid ${BASE_BORDER}`,
            borderRadius: 0,
            padding: '10px 14px',
            paddingRight: 32,
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: '0.06em',
            cursor: disabled ? 'not-allowed' : 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            outline: 'none',
            transition: 'border-color 120ms ease, box-shadow 120ms ease',
          }}
        >
          <option value="">—</option>
          {options.map((opt, i) => (
            <option
              key={i}
              value={renderOption ? opt.value : opt}
              style={{ background: '#000000', color: '#F5F5F0' }}
            >
              {renderOption ? opt.label : opt}
            </option>
          ))}
        </select>

        <span style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'rgba(245,245,240,0.4)',
          fontSize: 7,
          lineHeight: 1,
        }}>
          ▼
        </span>
      </div>
    </div>
  )
}

export default function Cascade({ onSelect }) {
  const [makes, setMakes]   = useState([])
  const [models, setModels] = useState([])
  const [years, setYears]   = useState([])
  const [trims, setTrims]   = useState([])

  const [make, setMake]     = useState('')
  const [model, setModel]   = useState('')
  const [year, setYear]     = useState('')
  const [trimId, setTrimId] = useState('')

  const [loading, setLoading] = useState({ makes: true, models: false, years: false, trims: false })

  useEffect(() => {
    getMakes()
      .then(setMakes)
      .finally(() => setLoading(l => ({ ...l, makes: false })))
  }, [])

  useEffect(() => {
    setModel(''); setYear(''); setTrimId('')
    setModels([]); setYears([]); setTrims([])
    if (!make) return
    setLoading(l => ({ ...l, models: true }))
    getModels(make)
      .then(setModels)
      .finally(() => setLoading(l => ({ ...l, models: false })))
  }, [make])

  useEffect(() => {
    setYear(''); setTrimId('')
    setYears([]); setTrims([])
    if (!make || !model) return
    setLoading(l => ({ ...l, years: true }))
    getYears(make, model)
      .then(data => setYears(data.map(String)))
      .finally(() => setLoading(l => ({ ...l, years: false })))
  }, [model])

  useEffect(() => {
    setTrimId('')
    setTrims([])
    if (!make || !model || !year) return
    setLoading(l => ({ ...l, trims: true }))
    getTrims(make, model, year)
      .then(setTrims)
      .finally(() => setLoading(l => ({ ...l, trims: false })))
  }, [year])

  useEffect(() => {
    if (trimId) onSelect(parseInt(trimId, 10))
  }, [trimId])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px 20px',
    }}>
      <Dropdown
        label="Make"
        value={make}
        options={makes}
        disabled={loading.makes}
        onChange={setMake}
      />
      <Dropdown
        label="Model"
        value={model}
        options={models}
        disabled={!make || loading.models}
        onChange={setModel}
      />
      <Dropdown
        label="Year"
        value={year}
        options={years}
        disabled={!model || loading.years}
        onChange={setYear}
      />
      <Dropdown
        label="Trim"
        value={trimId}
        options={trims.map(t => ({ value: String(t.id), label: t.trim }))}
        disabled={!year || loading.trims}
        onChange={setTrimId}
        renderOption
      />
    </div>
  )
}
