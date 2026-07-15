import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES, cityFor } from '../data/cities'
import { formatDate, formatUSD } from '../utils/helpers'
import TripMap from '../components/TripMap'
import NotAuthorized from '../components/NotAuthorized'

export default function LocationPage({ userEmail }) {
  const { slug } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading location…</div>

  const city = CITIES[slug]
  const days = [...items]
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .filter((d) => cityFor(d.isTravelDay ? d.cityNight : d.cityDay) === slug)

  if (!city || days.length === 0) {
    return (
      <div className="empty-state">
        <p>Can't find that location.</p>
        <Link className="btn" to="/">Back to itinerary</Link>
      </div>
    )
  }

  const lodgingDay = days.find((d) => d.lodging)
  const mapsUrl = city.coords ? `https://www.google.com/maps?q=${city.coords[0]},${city.coords[1]}` : null

  return (
    <div style={{ '--city-color': city.color }}>
      <Link to="/" className="mono muted" style={{ fontSize: 12 }}>&larr; Itinerary</Link>
      <h1 className="section-heading" style={{ color: city.color }}>{city.label}</h1>

      <div className="card">
        {lodgingDay?.lodging && (
          <div className="info-row">
            <span className="info-label">Lodging</span>
            <span>
              {lodgingDay.lodging.provider}
              {lodgingDay.lodging.cost ? ` · ${formatUSD(lodgingDay.lodging.cost)}` : ''}
              {lodgingDay.lodging.checkIn ? ` · Check-in ${lodgingDay.lodging.checkIn}` : ''}
              {lodgingDay.lodging.checkOut ? ` · Check-out ${lodgingDay.lodging.checkOut}` : ''}
              {lodgingDay.lodging.link && (
                <>
                  {' · '}
                  <a href={lodgingDay.lodging.link} target="_blank" rel="noreferrer">reservation</a>
                </>
              )}
            </span>
          </div>
        )}
        {mapsUrl && (
          <div className="info-row">
            <span className="info-label">Maps</span>
            <span><a href={mapsUrl} target="_blank" rel="noreferrer">Open {city.label} in Google Maps</a></span>
          </div>
        )}
      </div>

      <TripMap days={items} highlightSlug={slug} />

      <div style={{ marginTop: 16 }}>
        {days.map((day) => (
          <div className="card" key={day.id}>
            <div className="mono muted" style={{ fontSize: 12 }}>{formatDate(day.date)} · Day {day.dayNumber}</div>
            {(day.activities ?? []).length === 0 ? (
              <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>{day.notes || 'Open day'}</div>
            ) : (
              day.activities.map((a) => (
                <Link key={a.id} to={`/activity/${a.id}`} className="info-row activity-row">
                  <span className="info-label">{a.emoji}</span>
                  <span>
                    {a.name}
                    {a.cost != null ? ` · ${formatUSD(a.cost)}` : ''}
                  </span>
                </Link>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
