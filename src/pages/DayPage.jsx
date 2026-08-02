import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES } from '../data/cities'
import { resolveDaySlug } from '../data/tripData'
import { activityLocation, categorySummary, dayTitle, formatShortDate, formatUSD, parseDirectionsUrl } from '../utils/helpers'
import { useSetRegion } from '../context/RegionContext'
import TripMap from '../components/TripMap'
import Icon from '../components/Icon'
import NotAuthorized from '../components/NotAuthorized'

export default function DayPage({ userEmail }) {
  const { dayId } = useParams()
  const { items, loading, error } = useFirestoreCollection('days')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [dayId])

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
  const activities = day.activities ?? []
  const activity = activities[activeIndex] ?? activities[0] ?? null
  const route = parseDirectionsUrl(activity?.directionsUrl)

  // Every activity scheduled today gets a pin, not just whichever tab is
  // selected -- the active tab's full turn-by-turn route (when it has one)
  // is layered on top for extra detail on the walk/route being viewed.
  const activePins = (route
    ? route.map(([lat, lon]) => ({ lat, lon }))
    : [activityLocation(activity)].filter(Boolean)
  ).map((loc) => ({ ...loc, label: activity?.name }))
  const otherPins = activities
    .filter((a) => a !== activity)
    .flatMap((a) => {
      const loc = activityLocation(a)
      return loc ? [{ ...loc, label: a.name }] : []
    })
  const dayMarkers = [...activePins, ...otherPins].map((loc) => ({ ...loc, color: city.color }))
  const dayMapLink = activity?.directionsUrl || (day.coords ? `https://www.google.com/maps?q=${day.coords[0]},${day.coords[1]}` : undefined)

  // Days with more than one activity (e.g. two alternative Sunday plans)
  // are distinct, optional itineraries -- shown as tabs rather than
  // merged into one confusing chronological list. Only the selected
  // activity's own events get flattened into the connected timeline.
  const rows = []
  if (activity) {
    rows.push({ kind: 'activity', key: `a-${activity.id}`, activity })
    for (const [i, event] of (activity.events ?? []).entries()) {
      rows.push({ kind: 'event', key: `e-${activity.id}-${i}`, activity, event })
    }
  }

  return (
    <div
      style={{ '--city-color': city.color, '--city-on': city.onColor, '--city-text-safe': city.textColor }}
      data-region={slug}
    >
      <Link to={`/location/${slug}`} className="back-btn">← Back to {city.label}</Link>

      <div className="detail-header">
        <span className="detail-day-badge">{formatShortDate(day.date)}</span>
        <span>
          <div className="detail-title">{dayTitle(day)}</div>
          <div className="detail-date">{categorySummary(activities)}</div>
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

      {dayMarkers.length > 0 ? (
        <TripMap
          markers={dayMarkers}
          height={200}
          alt={`Map for ${dayTitle(day)}`}
          link={dayMapLink}
        />
      ) : day.coords ? (
        <TripMap
          center={day.coords}
          zoom={12}
          height={200}
          alt={`Map of ${day.cityDay}`}
          markers={[{ lat: day.coords[0], lon: day.coords[1], color: city.color, label: day.cityDay }]}
          link={`https://www.google.com/maps?q=${day.coords[0]},${day.coords[1]}`}
        />
      ) : null}

      {activities.length > 1 && (
        <div className="activity-tabs" role="tablist" aria-label="Options for this day">
          {activities.map((a, i) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`activity-tab${i === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <Icon name={a.icon} size={16} />
              <span>{a.tabLabel || a.name}</span>
            </button>
          ))}
        </div>
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
                    {a.travelers?.length > 0 && <div className="timeline-note">Travelers: {a.travelers.join(', ')}</div>}
                    {(a.startDirectionsUrl || a.directionsUrl || a.websiteUrl) && (
                      <div className="timeline-actions">
                        {a.startDirectionsUrl && (
                          <a
                            href={a.startDirectionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn"
                            style={{ display: 'inline-block', textDecoration: 'none' }}
                          >
                            {a.startDirectionsLabel || 'Get directions to the start'}
                          </a>
                        )}
                        {a.directionsUrl && (
                          <a
                            href={a.directionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn primary"
                            style={{ display: 'inline-block', textDecoration: 'none' }}
                          >
                            {a.linkLabel || 'Get directions for this day'}
                          </a>
                        )}
                        {a.websiteUrl && (
                          <a
                            href={a.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn"
                            style={{ display: 'inline-block', textDecoration: 'none' }}
                          >
                            {a.websiteLabel || 'Visit website'}
                          </a>
                        )}
                      </div>
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
                  {row.event.wikipediaUrl && (
                    <a href={row.event.wikipediaUrl} target="_blank" rel="noreferrer" className="timeline-wiki-link">
                      Read more on Wikipedia
                    </a>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {activity?.tips?.length > 0 && (
        <div className="card">
          {activity.tips.map((t, i) => (
            <p className="tip" key={i}>{t}</p>
          ))}
        </div>
      )}
    </div>
  )
}
