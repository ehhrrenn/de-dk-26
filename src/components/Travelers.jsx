import { useState } from 'react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import NotAuthorized from './NotAuthorized'

const BLANK = {
  name: '', passportNo: '', dob: '', placeOfBirth: '', sex: '', issueDate: '', expiryDate: '',
}

function mask(value) {
  if (!value) return ''
  if (value.length <= 4) return value
  return '••••' + value.slice(-4)
}

export default function Travelers({ userEmail }) {
  const { items, loading, error, add, remove } = useFirestoreCollection('travelers')
  const [form, setForm] = useState(null)
  const [revealed, setRevealed] = useState({})

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading travelers…</div>

  async function save(e) {
    e.preventDefault()
    const id = `traveler-${Date.now()}`
    await add(id, form)
    setForm(null)
  }

  return (
    <div>
      <h1 className="section-heading">Travelers</h1>
      <p className="muted" style={{ fontSize: 13, marginTop: -10, marginBottom: 16 }}>
        Passport details entered here go straight to Firestore — they're never stored in the
        app's code or GitHub repo. Numbers are masked until tapped.
      </p>

      {items.length === 0 && !form && (
        <div className="empty-state">No travelers added yet.</div>
      )}

      {items.map((t) => (
        <div className="card" key={t.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{t.name}</strong>
            <button className="btn ghost" onClick={() => remove(t.id)} aria-label={`Remove ${t.name}`}>✕</button>
          </div>
          <div className="mono muted" style={{ fontSize: 13, marginTop: 6 }}>
            <button
              className="btn ghost"
              style={{ padding: '2px 8px', fontSize: 12 }}
              onClick={() => setRevealed((r) => ({ ...r, [t.id]: !r[t.id] }))}
            >
              {revealed[t.id] ? t.passportNo : mask(t.passportNo)}
            </button>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            DOB {t.dob} · {t.placeOfBirth} · {t.sex}
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Issued {t.issueDate} · Expires {t.expiryDate}
          </div>
        </div>
      ))}

      {form ? (
        <form className="card" onSubmit={save}>
          {[
            ['name', 'Full name (as on passport)', 'text'],
            ['passportNo', 'Passport number', 'text'],
            ['dob', 'Date of birth', 'date'],
            ['placeOfBirth', 'Place of birth', 'text'],
            ['sex', 'Sex (as on passport)', 'text'],
            ['issueDate', 'Issue date', 'date'],
            ['expiryDate', 'Expiry date', 'date'],
          ].map(([key, label, type]) => (
            <div className="field" key={key}>
              <label htmlFor={key}>{label}</label>
              <input
                id={key}
                type={type}
                required={key === 'name'}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary" type="submit">Save traveler</button>
            <button className="btn ghost" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn primary" onClick={() => setForm(BLANK)}>+ Add traveler</button>
      )}
    </div>
  )
}
