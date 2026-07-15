import { useState } from 'react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { DAYS, TRIP } from '../data/tripData'
import DayCard from './DayCard'
import { formatUSD, totalCost } from '../utils/helpers'
import NotAuthorized from './NotAuthorized'

export default function Timeline({ userEmail }) {
  const { items, loading, error, add } = useFirestoreCollection('days')
  const [importing, setImporting] = useState(false)

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading itinerary…</div>

  async function importSeedData() {
    setImporting(true)
    try {
      for (const day of DAYS) {
        // eslint-disable-next-line no-await-in-loop
        await add(day.id, day)
      }
    } finally {
      setImporting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No itinerary data in Firestore yet.</p>
        <button className="btn primary" onClick={importSeedData} disabled={importing}>
          {importing ? 'Importing…' : 'Import starter data from the sheet'}
        </button>
      </div>
    )
  }

  const days = [...items].sort((a, b) => a.dayNumber - b.dayNumber)
  const spent = totalCost(days)

  return (
    <div>
      <h1 className="section-heading">Itinerary</h1>
      <div className="card mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>Tracked so far: {formatUSD(spent)}</span>
        <span className="muted">Per adult est: {formatUSD(TRIP.budget.perAdult)}</span>
      </div>
      {days.map((d) => (
        <DayCard key={d.id} day={d} />
      ))}
    </div>
  )
}
