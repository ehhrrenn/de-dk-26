import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { resolveDaySlug, locationsFromDays } from '../data/tripData'
import { formatDate, formatUSD, mapsDirectionsUrl } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import StaticMap from '../components/StaticMap'
import DayBookings from '../components/DayBookings'
import NotAuthorized from '../components/NotAuthorized'

export default function DayPage({ userEmail }) {
  const { dayId } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')

  const sorted = [...items].sort((a, b) => a.dayNumber - b.dayNumber)
  const day = sorted.find((d) => d.id === dayId)
  const slug = day ? resolveDaySlug(day, sorted) : null
  useSetRegion(slug)

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading day…</div>

  if (!day) {
    return (
      <div className="empty-state">
        <p>Can't find that day.</p>
        <Link className="btn" to="/">Back to itinerary</Link>
      </div>
    )
  }

  const city = CITIES[slug]
  const location = locationsFromDays(items).find((l) => l.slug === slug)
  const lodging = location?.lodging
  const lodgingMapsUrl = mapsDirectionsUrl(lodging?.address)

  return (
    <div className="region-page" style={{ '--city-color': city.color }} data-region={slug}>
      <Link to={`/location/${slug}`} className="mono muted" style={{ fontSize: 13 }}>&larr; {city.label}</Link>
      <h1 className="section-heading">
        {formatDate(day.date)} · Day {day.dayNumber}
      </h1>
      <div className="mono muted" style={{ fontSize: 13, marginTop: -12, marginBottom: 16 }}>
        {day.isTravelDay ? `${day.cityDay} → ${day.cityNight}` : day.cityDay}
      </div>

      {day.isTravelDay && day.travel && (day.travel.mode || day.travel.time || day.travel.cost) && (
        <div className="card">
          <div className="info-row">
            <span className="info-label">Travel</span>
            <span>
              {day.travel.mode || 'Travel'}
              {day.travel.time ? ` · ${day.travel.time}` : ''}
              {day.travel.cost ? ` · ${formatUSD(day.travel.cost)}` : ''}
            </span>
          </div>
        </div>
      )}

      {lodging && (
        <div className="card">
          {lodging.name && (
            <div className="info-row">
              <span className="info-label">Stay</span>
              <span>{lodging.name}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">Provider</span>
            <span>
              {lodging.provider}
              {lodging.cost ? ` · ${formatUSD(lodging.cost)}` : ''}
              {lodging.checkIn ? ` · Check-in ${lodging.checkIn}` : ''}
              {lodging.checkOut ? ` · Check-out ${lodging.checkOut}` : ''}
              {lodging.link && (
                <>
                  {' · '}
                  <a href={lodging.link} target="_blank" rel="noreferrer">reservation</a>
                </>
              )}
            </span>
          </div>
          {lodging.address && (
            <div className="info-row">
              <span className="info-label">Address</span>
              <span>{lodging.address}</span>
            </div>
          )}
          {lodgingMapsUrl && (
            <a
              href={lodgingMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn primary"
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 10 }}
            >
              Get directions to the stay
            </a>
          )}
        </div>
      )}

      {day.coords && (
        <StaticMap
          center={day.coords}
          zoom={13}
          height={220}
          alt={`Map of Day ${day.dayNumber}`}
          markers={[{ lat: day.coords[0], lon: day.coords[1], color: city.color }]}
        />
      )}

      <div style={{ marginTop: 16 }}>
        {(day.activities ?? []).length === 0 ? (
          <div className="card muted">{day.notes || 'Open day — nothing scheduled yet.'}</div>
        ) : (
          day.activities.map((a) => (
            <div className="card" key={a.id}>
              <Link to={`/activity/${a.id}`} className="info-row activity-row">
                <span className="info-label">{a.emoji}</span>
                <span>
                  {a.name}
                  {a.cost != null ? ` · ${formatUSD(a.cost)}` : ''}
                </span>
              </Link>
              {a.summary && (
                <p className="muted" style={{ fontSize: 13, marginTop: 4, marginBottom: 0 }}>{a.summary}</p>
              )}
              {a.directionsUrl && (
                <a
                  href={a.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mono"
                  style={{ fontSize: 12, display: 'inline-block', marginTop: 6 }}
                >
                  Get directions →
                </a>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <DayBookings dayId={day.id} />
      </div>
    </div>
  )
}
