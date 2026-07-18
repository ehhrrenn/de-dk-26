import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { resolveDaySlug } from '../data/tripData'
import { formatDate, formatUSD } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import StaticMap from '../components/StaticMap'
import Icon from '../components/Icon'
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

  // Flatten each activity into a "venue" row followed by its timed events,
  // so the whole day renders as one continuous connected timeline instead of
  // separate mini-timelines per activity.
  const rows = []
  for (const activity of day.activities ?? []) {
    rows.push({ kind: 'activity', key: `a-${activity.id}`, activity })
    for (const [i, event] of (activity.events ?? []).entries()) {
      rows.push({ kind: 'event', key: `e-${activity.id}-${i}`, activity, event })
    }
  }
  const allTips = (day.activities ?? []).flatMap((a) => a.tips ?? [])

  return (
    <div
      style={{ '--city-color': city.color, '--city-on': city.onColor, '--city-text-safe': city.textColor }}
      data-region={slug}
    >
      <Link to={`/location/${slug}`} className="back-btn">← Back to {city.label}</Link>

      <div className="detail-header">
        <span className="detail-day-badge">{day.dayNumber}</span>
        <span>
          <div className="detail-title">
            {day.isTravelDay ? `${day.cityDay} → ${day.cityNight}` : day.cityDay}
          </div>
          <div className="detail-date">{formatDate(day.date)}</div>
        </span>
      </div>

      {day.notes && <p className="muted" style={{ margin: '0 0 14px' }}>{day.notes}</p>}

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

      {day.coords && (
        <StaticMap
          center={day.coords}
          zoom={12}
          height={200}
          alt={`Map of ${day.cityDay}`}
          markers={[{ lat: day.coords[0], lon: day.coords[1], color: city.color }]}
        />
      )}

      {rows.length > 0 && (
        <div className="timeline">
          {rows.map((row, i) => {
            const isLast = i === rows.length - 1
            if (row.kind === 'activity') {
              const a = row.activity
              return (
                <div className="timeline-item" key={row.key}>
                  <span className="timeline-rail">
                    <span className="timeline-dot activity-dot" />
                    {!isLast && <span className="timeline-line" />}
                  </span>
                  <span className="timeline-body">
                    <div className="timeline-venue">
                      <Icon name={a.icon} size={19} />
                      <span>
                        {a.name}
                        {a.cost != null ? ` · ${formatUSD(a.cost)}` : ''}
                      </span>
                    </div>
                    {a.summary && <div className="timeline-note">{a.summary}</div>}
                    {a.startingPoint && <div className="timeline-note">Start: {a.startingPoint}</div>}
                    {a.directionsUrl && (
                      <a href={a.directionsUrl} target="_blank" rel="noreferrer" className="timeline-directions">
                        Get directions for this day →
                      </a>
                    )}
                  </span>
                </div>
              )
            }
            return (
              <div className="timeline-item" key={row.key}>
                <span className="timeline-rail">
                  <span className="timeline-dot" />
                  {!isLast && <span className="timeline-line" />}
                </span>
                <span className="timeline-body">
                  <div className="timeline-time mono">{row.event.time}</div>
                  <div className="timeline-title">{row.event.title}</div>
                  {row.event.description && <div className="timeline-note">{row.event.description}</div>}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {allTips.length > 0 && (
        <div className="card">
          {allTips.map((t, i) => (
            <p className="tip" key={i}>{t}</p>
          ))}
        </div>
      )}
    </div>
  )
}
