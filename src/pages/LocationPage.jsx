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

  const { lodging } = location
  const lodgingMapsUrl = mapsDirectionsUrl(lodging?.address)
  const cityMapsUrl = city.coords ? `https://www.google.com/maps?q=${city.coords[0]},${city.coords[1]}` : null

  return (
    <div style={{ '--city-color': city.color, '--city-text': city.onColor }} data-region={slug}>
      <h1 className="section-heading">{city.label}</h1>

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
          <div className="day-card" key={day.id}>
            <div className="day-card-header">
              <span className="day-number">{day.dayNumber}</span>
              <span className="day-headline">
                <div className="day-date">{formatDate(day.date)}</div>
                {day.isTravelDay && (
                  <div className="day-sub">{day.cityDay} → {day.cityNight}</div>
                )}
              </span>
            </div>

            <div className="day-card-body">
              {day.notes && <p className="muted" style={{ fontSize: 14, margin: '0 0 8px' }}>{day.notes}</p>}

              {day.isTravelDay && day.travel && (day.travel.mode || day.travel.time || day.travel.cost) && (
                <div className="info-row">
                  <span className="info-label">Travel</span>
                  <span>
                    {day.travel.mode || 'Travel'}
                    {day.travel.time ? ` · ${day.travel.time}` : ''}
                    {day.travel.cost ? ` · ${formatUSD(day.travel.cost)}` : ''}
                  </span>
                </div>
              )}

              {(day.activities ?? []).map((a) => (
                <div key={a.id} className="activity-block">
                  <Link to={`/activity/${a.id}`} className="activity-button">
                    <span className="activity-button-emoji">{a.emoji}</span>
                    <span className="activity-button-text">
                      {a.name}
                      {a.cost != null ? ` · ${formatUSD(a.cost)}` : ''}
                    </span>
                    <span className="activity-button-chevron">›</span>
                  </Link>
                  {a.summary && (
                    <p className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 0 }}>{a.summary}</p>
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
