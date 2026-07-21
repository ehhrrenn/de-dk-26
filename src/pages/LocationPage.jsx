import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { SAVED_PLACES } from '../data/savedPlaces'
import { locationsFromDays } from '../data/tripData'
import { formatDate, mapsDirectionsUrl, mapsSearchUrl } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import StaticMap from '../components/StaticMap'
import Icon from '../components/Icon'
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
  const places = SAVED_PLACES[slug] || []

  return (
    <div style={{ '--city-color': city.color, '--city-on': city.onColor, '--city-text-safe': city.textColor }} data-region={slug}>
      <h1 className="section-heading">{city.label}</h1>

      {/* Lodging details live in the sticky KeyInfoBar (name, address,
          directions, provider/cost, reservation link) -- no separate card
          here to avoid showing the same stay twice on one page. */}
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
          markers={[
            { lat: city.coords[0], lon: city.coords[1], color: city.color },
            ...places.map((p) => ({ query: `${p.name}, ${city.country}`, color: city.color })),
          ]}
        />
      )}

      <div className="cards">
        <div className="cards-title">Itinerary</div>
        <div className="day-list">
          {location.days.map((day) => {
            const activityNames = (day.activities ?? []).map((a) => a.name).join(' + ')
            const title = day.isTravelDay ? `${day.cityDay} → ${day.cityNight}` : (activityNames || 'Free day')
            return (
              <Link key={day.id} to={`/day/${day.id}`} className="day-card">
                <span className="day-badge">{day.dayNumber}</span>
                <span className="day-content">
                  <div className="day-title">{title}</div>
                  <div className="day-sub">{formatDate(day.date)}</div>
                </span>
                <span className="day-chevron">›</span>
              </Link>
            )
          })}
        </div>
      </div>

      {places.length > 0 && (
        <div className="cards">
          <div className="cards-title">Saved places</div>
          <div className="day-list">
            {places.map((p) => (
              <a
                key={p.name}
                href={mapsSearchUrl(`${p.name}, ${city.country}`)}
                target="_blank"
                rel="noreferrer"
                className="day-card"
              >
                <span className="day-badge" style={{ background: city.tint, color: city.textColor }}>
                  <Icon name="pin" size={18} />
                </span>
                <span className="day-content">
                  <div className="day-title">{p.name}</div>
                  <div className="day-sub">{p.category}</div>
                </span>
                <span className="day-chevron">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
