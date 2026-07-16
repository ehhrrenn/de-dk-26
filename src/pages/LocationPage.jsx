import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { locationsFromDays } from '../data/tripData'
import { formatDate, formatUSD, mapsDirectionsUrl } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import StaticMap from '../components/StaticMap'
import NotAuthorized from '../components/NotAuthorized'

export default function LocationPage({ userEmail }) {
  const { slug } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')
  useSetRegion(CITIES[slug] ? slug : null)

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading location…</div>

  const city = CITIES[slug]
  const location = locationsFromDays(items).find((l) => l.slug === slug)

  if (!city || !location) {
    return (
      <div className="empty-state">
        <p>Can't find that location.</p>
        <Link className="btn" to="/">Back to itinerary</Link>
      </div>
    )
  }

  const { lodging, arrival } = location
  const lodgingMapsUrl = mapsDirectionsUrl(lodging?.address)
  const cityMapsUrl = city.coords ? `https://www.google.com/maps?q=${city.coords[0]},${city.coords[1]}` : null

  return (
    <div className="region-page" style={{ '--city-color': city.color }} data-region={slug}>
      <Link to="/" className="mono muted" style={{ fontSize: 13 }}>&larr; Itinerary</Link>
      <h1 className="section-heading">{city.label}</h1>

      {arrival && (
        <div className="card">
          <div className="info-row">
            <span className="info-label">Getting here</span>
            <span>
              {arrival.travel?.mode || 'Travel'}
              {arrival.travel?.time ? ` · ${arrival.travel.time}` : ''}
              {arrival.travel?.cost ? ` · ${formatUSD(arrival.travel.cost)}` : ''}
              {' · '}
              <Link to={`/day/${arrival.id}`}>Day {arrival.dayNumber} details</Link>
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

      {!lodgingMapsUrl && cityMapsUrl && (
        <div className="card">
          <div className="info-row">
            <span className="info-label">Maps</span>
            <span><a href={cityMapsUrl} target="_blank" rel="noreferrer">Open {city.label} in Google Maps</a></span>
          </div>
        </div>
      )}

      {city.coords && (
        <StaticMap
          center={city.coords}
          zoom={11}
          height={260}
          alt={`Map of ${city.label}`}
          markers={[{ lat: city.coords[0], lon: city.coords[1], color: city.color }]}
        />
      )}

      <div style={{ marginTop: 16 }}>
        {location.days.map((day) => (
          <Link
            key={day.id}
            to={`/day/${day.id}`}
            className="day-card"
            style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '14px 16px', textDecoration: 'none', color: 'inherit' }}
          >
            <span className="day-number">{day.dayNumber}</span>
            <span className="day-headline">
              <div className="day-date">{formatDate(day.date)}</div>
              <div className="day-title">
                {day.notes || (day.activities?.length
                  ? `${day.activities.length} activit${day.activities.length === 1 ? 'y' : 'ies'}`
                  : 'Open day')}
              </div>
              {day.isTravelDay && (
                <div className="day-sub">Travel day · {day.cityDay} → {day.cityNight}</div>
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
