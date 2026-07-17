import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { resolveDaySlug } from '../data/tripData'
import { formatUSD } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import NotAuthorized from '../components/NotAuthorized'

export default function ActivityPage({ userEmail }) {
  const { activityId } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')

  const sorted = [...items].sort((a, b) => a.dayNumber - b.dayNumber)
  const day = sorted.find((d) => d.activities?.some((a) => a.id === activityId))
  const activity = day?.activities.find((a) => a.id === activityId)
  const slug = day ? resolveDaySlug(day, sorted) : null
  useSetRegion(slug)

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading activity…</div>

  if (!day || !activity) {
    return (
      <div className="empty-state">
        <p>Can't find that activity.</p>
        <Link className="btn" to="/">Back to itinerary</Link>
      </div>
    )
  }

  const city = CITIES[slug]

  return (
    <div className="region-page" style={{ '--city-color': city.color }} data-region={slug}>
      <Link to={`/location/${slug}`} className="mono muted" style={{ fontSize: 13 }}>&larr; {city.label}</Link>
      <h1 className="section-heading">{activity.emoji} {activity.name}</h1>

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
