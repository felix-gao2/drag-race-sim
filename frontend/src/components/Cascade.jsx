import { useState, useEffect } from 'react'
import { getMakes, getModels, getYears, getTrims } from '../api'

const selectStyle = (disabled) => ({
  width: '100%',
  background: 'var(--color-surface-2)',
  color: disabled ? 'var(--color-muted)' : 'var(--color-text)',
  border: '1px solid var(--color-border)',
  padding: '0.625rem 0.75rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  appearance: 'none',
  outline: 'none',
  transition: 'border-color 0.15s',
})

function Dropdown({ label, value, options, disabled, onChange, renderOption }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
      }}>
        {label}
      </span>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          style={selectStyle(disabled)}
          onFocus={e => { if (!disabled) e.target.style.borderColor = 'var(--color-yellow)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
        >
          <option value="">—</option>
          {options.map((opt, i) => (
            <option key={i} value={renderOption ? opt.value : opt}>
              {renderOption ? opt.label : opt}
            </option>
          ))}
        </select>
        {/* custom chevron */}
        <span style={{
          position: 'absolute',
          right: '0.625rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: disabled ? 'var(--color-border)' : 'var(--color-muted)',
          fontSize: '0.6rem',
        }}>▼</span>
      </div>
    </label>
  )
}

export default function Cascade({ onSelect, accentColor }) {
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [trims, setTrims] = useState([]) // [{id, trim}]

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
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
      gap: '0.875rem',
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
