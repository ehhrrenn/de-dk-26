import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { SAVED_PLACES } from '../data/savedPlaces'
import { locationsFromDays } from '../data/tripData'
import { activityLocation, categorySummary, dayTitle, formatShortDate, mapsSearchUrl } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import TripMap from '../components/TripMap'
import Icon from '../components/Icon'

export default function LocationPage() {
  const { slug } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')
  useSetRegion(CITIES[slug] ? slug : null)

  if (error) return <div className="empty-state">Couldn't load data.</div>
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
  const lodgingMapsUrl = mapsSearchUrl(lodging?.address)
  const cityMapsUrl = city.coords ? `https://www.google.com/maps?q=${city.coords[0]},${city.coords[1]}` : null
  const places = SAVED_PLACES[slug] || []
  // Every activity across every day spent in this location gets its own
  // pin, alongside the city center and saved places, so the map reflects
  // everywhere the itinerary actually goes here.
  const activityPins = location.days
    .flatMap((day) => day.activities ?? [])
    .flatMap((a) => {
      const loc = activityLocation(a)
      return loc ? [{ ...loc, label: a.name }] : []
    })

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
        <TripMap
          center={city.coords}
          zoom={11}
          height={260}
          alt={`Map of ${city.label}`}
          markers={[
            { lat: city.coords[0], lon: city.coords[1], color: city.color, label: city.label },
            ...places.map((p) => ({ query: `${p.name}, ${city.country}`, color: city.color, label: p.name })),
            ...activityPins.map((loc) => ({ ...loc, color: city.color })),
          ]}
          link={cityMapsUrl}
        />
      )}

      <div className="cards">
        <div className="cards-title">Itinerary</div>
        <div className="day-list">
          {location.days.map((day) => (
            <Link key={day.id} to={`/day/${day.id}`} className="day-card">
              <span className="day-badge">{formatShortDate(day.date)}</span>
              <span className="day-content">
                <div className="day-title">{dayTitle(day)}</div>
                <div className="day-sub">{categorySummary(day.activities)}</div>
              </span>
              <span className="day-chevron">›</span>
            </Link>
          ))}
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
