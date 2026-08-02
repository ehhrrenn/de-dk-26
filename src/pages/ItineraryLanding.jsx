import { useEffect, useRef } from 'react'
import { deleteField } from 'firebase/firestore'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { DAYS, locationsFromDays } from '../data/tripData'
import { TRAVELERS } from '../data/travelers'
import StaticMap from '../components/StaticMap'
import TripCalendar from '../components/TripCalendar'

export default function ItineraryLanding() {
  const { items, loading, error, add } = useFirestoreCollection('days')
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

  // Same auto-sync pattern for the traveler roster -- merge() only touches
  // the fields below, so anyone's edits (e.g. via the masked Settings form)
  // survive a re-sync of this seed data.
  const { loading: travelersLoading, error: travelersError, add: addTraveler } = useFirestoreCollection('travelers')
  const travelersSyncedRef = useRef(false)

  useEffect(() => {
    if (travelersLoading || travelersError || travelersSyncedRef.current) return
    travelersSyncedRef.current = true
    async function syncTravelers() {
      for (const traveler of TRAVELERS) {
        // eslint-disable-next-line no-await-in-loop
        await addTraveler(traveler.id, traveler)
      }
    }
    syncTravelers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelersLoading, travelersError])

  if (error) return <div className="empty-state">Couldn't load data.</div>
  if (loading || items.length === 0) return <div className="empty-state">Loading itinerary…</div>

  const locations = locationsFromDays(items)
  // Chronological order already (locationsFromDays walks CITIES' key order,
  // which is the trip's actual route) -- first/last become the directions
  // origin/destination, anything in between becomes a waypoint stop.
  const overviewMapsUrl =
    locations.length > 1
      ? `https://www.google.com/maps/dir/?api=1&origin=${locations[0].coords.join(',')}&destination=${locations[locations.length - 1].coords.join(',')}${
          locations.length > 2
            ? `&waypoints=${locations
                .slice(1, -1)
                .map((loc) => loc.coords.join(','))
                .join('%7C')}`
            : ''
        }&travelmode=driving`
      : locations[0]
        ? `https://www.google.com/maps?q=${locations[0].coords.join(',')}`
        : null

  return (
    <div>
      <StaticMap
        center={[51.64, 11.29]}
        zoom={5}
        height={280}
        alt="Map of the trip route across Munich, the Rhine Valley, Berlin, and Copenhagen"
        markers={locations.map((loc) => ({ lat: loc.coords[0], lon: loc.coords[1], color: loc.color }))}
        link={overviewMapsUrl}
      />

      <TripCalendar days={items} />
    </div>
  )
}
