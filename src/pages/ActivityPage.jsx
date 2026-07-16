import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES, cityFor } from '../data/cities'
import { formatDate, formatUSD } from '../utils/helpers'
import NotAuthorized from '../components/NotAuthorized'

export default function ActivityPage({ userEmail }) {
  const { activityId } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading activity…</div>

  const day = items.find((d) => d.activities?.some((a) => a.id === activityId))
  const activity = day?.activities.find((a) => a.id === activityId)

  if (!day || !activity) {
    return (
      <div className="empty-state">
        <p>Can't find that activity.</p>
        <Link className="btn" to="/">Back to itinerary</Link>
      </div>
    )
  }

  const slug = cityFor(day.isTravelDay ? day.cityNight : day.cityDay)
  const city = CITIES[slug]

  return (
    <div style={{ '--city-color': city.color }}>
      <Link to={`/location/${slug}`} className="mono muted" style={{ fontSize: 12 }}>&larr; {city.label}</Link>
      <h1 className="section-heading" style={{ color: city.color }}>{activity.emoji} {activity.name}</h1>
      <div className="mono muted" style={{ fontSize: 12, marginTop: -12, marginBottom: 16 }}>{formatDate(day.date)} · Day {day.dayNumber}</div>

      {activity.directionsUrl && (
        <a href={activity.directionsUrl} target="_blank" rel="noreferrer" className="btn primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: 12 }}>
          Get directions for this day
        </a>
      )}

      <div className="card">
        {activity.summary && (
          <div className="info-row">
            <span className="info-label">Overview</span>
            <span>{activity.summary}</span>
          </div>
        )}
        {activity.startingPoint && (
          <div className="info-row">
            <span className="info-label">Start</span>
            <span>{activity.startingPoint}</span>
          </div>
        )}
        {activity.cost != null && (
          <div className="info-row">
            <span className="info-label">Cost</span>
            <span>{formatUSD(activity.cost)}</span>
          </div>
        )}
      </div>

      {activity.events.length > 0 && (
        <div className="card">
          <div className="event-list" style={{ marginTop: 0 }}>
            {activity.events.map((e, i) => (
              <div className="event" key={i}>
                <span className="event-time mono">{e.time}</span>
                <span>
                  <div className="event-title">{e.title}</div>
                  <div className="event-desc">{e.description}</div>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activity.tips.length > 0 && (
        <div className="card">
          {activity.tips.map((t, i) => (
            <p className="tip" key={i}>{t}</p>
          ))}
        </div>
      )}
    </div>
  )
}
