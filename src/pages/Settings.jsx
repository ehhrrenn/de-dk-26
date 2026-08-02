import { useState } from 'react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { formatUSD } from '../utils/helpers'

const BLANK_TRAVELER = { name: '' }

const BOOKING_TYPES = ['Flight', 'Train', 'Hotel', 'Car', 'Ferry', 'Other']
const BLANK_BOOKING = { type: 'Flight', title: '', date: '', confirmation: '', cost: '', link: '', notes: '' }

export default function Settings() {
  const { items, loading, error, add, remove } = useFirestoreCollection('travelers')
  const { items: bookings, loading: bookingsLoading, error: bookingsError, add: addBooking, remove: removeBooking } = useFirestoreCollection('bookings')
  const [form, setForm] = useState(null)
  const [bookingForm, setBookingForm] = useState(null)

  if (error) return <div className="empty-state">Couldn't load data.</div>
  if (loading) return <div className="empty-state">Loading settings…</div>

  async function save(e) {
    e.preventDefault()
    const id = `traveler-${Date.now()}`
    await add(id, form)
    setForm(null)
  }

  async function saveBooking(e) {
    e.preventDefault()
    const id = `booking-${Date.now()}`
    await addBooking(id, { ...bookingForm, cost: bookingForm.cost ? Number(bookingForm.cost) : null })
    setBookingForm(null)
  }

  const sortedBookings = [...bookings].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  return (
    <div>
      <h1 className="section-heading">Settings</h1>

      <h2 className="subsection-heading">Travelers</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -10, marginBottom: 16 }}>
        Just names -- this site is public, so nothing sensitive (passport numbers, DOB, etc.)
        is collected here.
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
        </div>
      ))}

      {form ? (
        <form className="card" onSubmit={save}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary" type="submit">Save traveler</button>
            <button className="btn ghost" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn primary" style={{ marginTop: 16 }} onClick={() => setForm(BLANK_TRAVELER)}>+ Add traveler</button>
      )}

      <h2 className="subsection-heading">Bookings</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -10, marginBottom: 16 }}>
        Flights, trains, hotels, and other reservations for the group.
      </p>

      {!bookingsLoading && !bookingsError && (
        <>
          {sortedBookings.length === 0 && !bookingForm && (
            <div className="empty-state">No bookings yet.</div>
          )}

          {sortedBookings.map((b) => (
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
                <button className="btn ghost" onClick={() => removeBooking(b.id)} aria-label={`Remove ${b.title}`}>✕</button>
              </div>
            </div>
          ))}

          {bookingForm ? (
            <form className="card" onSubmit={saveBooking}>
              <div className="field">
                <label htmlFor="booking-type">Type</label>
                <select id="booking-type" value={bookingForm.type} onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}>
                  {BOOKING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="booking-title">Title</label>
                <input id="booking-title" required value={bookingForm.title} onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })} placeholder="e.g. LH 441 MUC → CPH" />
              </div>
              <div className="field">
                <label htmlFor="booking-date">Date</label>
                <input id="booking-date" type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="booking-conf">Confirmation #</label>
                <input id="booking-conf" value={bookingForm.confirmation} onChange={(e) => setBookingForm({ ...bookingForm, confirmation: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="booking-cost">Cost (USD)</label>
                <input id="booking-cost" type="number" value={bookingForm.cost} onChange={(e) => setBookingForm({ ...bookingForm, cost: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="booking-link">Link</label>
                <input id="booking-link" type="url" value={bookingForm.link} onChange={(e) => setBookingForm({ ...bookingForm, link: e.target.value })} placeholder="https://" />
              </div>
              <div className="field">
                <label htmlFor="booking-notes">Notes</label>
                <textarea id="booking-notes" rows={2} value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn primary" type="submit">Save booking</button>
                <button className="btn ghost" type="button" onClick={() => setBookingForm(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn primary" style={{ marginTop: 16 }} onClick={() => setBookingForm(BLANK_BOOKING)}>+ Add booking</button>
          )}
        </>
      )}
    </div>
  )
}
