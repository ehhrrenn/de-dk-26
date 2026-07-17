import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { deleteField } from 'firebase/firestore'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { DAYS, locationsFromDays } from '../data/tripData'
import { formatDate } from '../utils/helpers'
import { useSetHomeStatusDays } from '../context/HomeStatusContext'
import TripTimeline from '../components/TripTimeline'
import StaticMap from '../components/StaticMap'
import NotAuthorized from '../components/NotAuthorized'

export default function ItineraryLanding({ userEmail }) {
  const { items, loading, error, add } = useFirestoreCollection('days')
  useSetHomeStatusDays(items)
  const syncedRef = useRef(false)

  // Firestore is the live source of truth, but the code (DAYS) is where
  // itinerary content actually gets edited -- merge it in automatically
  // every time the home page loads instead of requiring a manual button.
  useEffect(() => {
    if (loading || error || syncedRef.current) return
    syncedRef.current = true
    async function sync() {
      for (const day of DAYS) {
        // eslint-disable-next-line no-await-in-loop
        await add(day.id, { ...day, activity: deleteField(), detailsLinks: deleteField() })
      }
    }
    sync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error])

  if (error) return <NotAuthorized email={userEmail} />
  if (loading || items.length === 0) return <div className="empty-state">Loading itinerary…</div>

  const locations = locationsFromDays(items)

  return (
    <div>
      <h1 className="section-heading">Itinerary</h1>
      <TripTimeline locations={locations} />
      <StaticMap
        center={[51.64, 11.29]}
        zoom={5}
        height={280}
        alt="Map of the trip route across Munich, the Rhine Valley, Berlin, and Copenhagen"
        markers={locations.map((loc) => ({ lat: loc.coords[0], lon: loc.coords[1], color: loc.color }))}
      />

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
    </div>
  )
}
