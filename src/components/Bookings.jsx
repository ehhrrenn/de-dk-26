import { useState } from 'react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { formatUSD } from '../utils/helpers'
import NotAuthorized from './NotAuthorized'

const TYPES = ['Flight', 'Train', 'Hotel', 'Car', 'Ferry', 'Other']

const BLANK = { type: 'Flight', title: '', date: '', confirmation: '', cost: '', link: '', notes: '' }

export default function Bookings({ userEmail }) {
  const { items, loading, error, add, remove } = useFirestoreCollection('bookings')
  const [form, setForm] = useState(null)

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading bookings…</div>

  const bookings = [...items].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  async function save(e) {
    e.preventDefault()
    const id = `booking-${Date.now()}`
    await add(id, { ...form, cost: form.cost ? Number(form.cost) : null })
    setForm(null)
  }

  return (
    <div>
      <h1 className="section-heading">Bookings</h1>

      {bookings.length === 0 && !form && (
        <div className="empty-state">No bookings yet — add flights, trains, and hotel confirmations here.</div>
      )}

      {bookings.map((b) => (
        <div className="card" key={b.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div className="mono muted" style={{ fontSize: 11, textTransform: 'uppercase' }}>{b.type} {b.date ? `· ${b.date}` : ''}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2 }}>{b.title}</div>
              {b.confirmation && <div className="mono muted" style={{ fontSize: 12, marginTop: 4 }}>Conf# {b.confirmation}</div>}
              {b.notes && <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{b.notes}</div>}
              <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 13 }}>
                {b.cost != null && <span>{formatUSD(b.cost)}</span>}
                {b.link && <a href={b.link} target="_blank" rel="noreferrer">details</a>}
              </div>
            </div>
            <button className="btn ghost" onClick={() => remove(b.id)} aria-label={`Remove ${b.title}`}>✕</button>
          </div>
        </div>
      ))}

      {form ? (
        <form className="card" onSubmit={save}>
          <div className="field">
            <label htmlFor="type">Type</label>
            <select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. LH 441 MUC → CPH" />
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="conf">Confirmation #</label>
            <input id="conf" value={form.confirmation} onChange={(e) => setForm({ ...form, confirmation: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="cost">Cost (USD)</label>
            <input id="cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="link">Link</label>
            <input id="link" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://" />
          </div>
          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary" type="submit">Save booking</button>
            <button className="btn ghost" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn primary" onClick={() => setForm(BLANK)}>+ Add booking</button>
      )}
    </div>
  )
}
