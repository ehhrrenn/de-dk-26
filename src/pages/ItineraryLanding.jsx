import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteField } from 'firebase/firestore'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { DAYS, locationsFromDays } from '../data/tripData'
import { formatDate } from '../utils/helpers'
import TripTimeline from '../components/TripTimeline'
import TripMap from '../components/TripMap'
import NotAuthorized from '../components/NotAuthorized'

export default function ItineraryLanding({ userEmail }) {
  const { items, loading, error, add } = useFirestoreCollection('days')
  const [importing, setImporting] = useState(false)

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading itinerary…</div>

  async function syncSeedData() {
    setImporting(true)
    try {
      for (const day of DAYS) {
        // eslint-disable-next-line no-await-in-loop
        await add(day.id, { ...day, activity: deleteField(), detailsLinks: deleteField() })
      }
    } finally {
      setImporting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No itinerary data in Firestore yet.</p>
        <button className="btn primary" onClick={syncSeedData} disabled={importing}>
          {importing ? 'Importing…' : 'Import starter data from the sheet'}
        </button>
      </div>
    )
  }

  const locations = locationsFromDays(items)

  return (
    <div>
      <h1 className="section-heading">Itinerary</h1>
      <TripTimeline locations={locations} />
      <TripMap days={items} />

      <div className="location-cards">
        {locations.map((loc) => (
          <Link key={loc.slug} to={`/location/${loc.slug}`} className="card location-card" style={{ '--city-color': loc.color }}>
            <span className="location-card-swatch" />
            <span>
              <div className="location-card-label">{loc.label}</div>
              <div className="location-card-dates muted mono">
                {formatDate(loc.dateRange.start)}
                {loc.dateRange.end !== loc.dateRange.start ? ` – ${formatDate(loc.dateRange.end)}` : ''}
                {' · '}{loc.days.length} day{loc.days.length === 1 ? '' : 's'}
              </div>
            </span>
          </Link>
        ))}
      </div>

      <button className="btn" onClick={syncSeedData} disabled={importing} style={{ marginTop: 8 }}>
        {importing ? 'Syncing…' : 'Sync latest itinerary details'}
      </button>
    </div>
  )
}
