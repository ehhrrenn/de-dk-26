import { Link } from 'react-router-dom'
import { CITIES } from '../data/cities'
import { resolveDaySlug } from '../data/tripData'
import { dayTitle, formatDate } from '../utils/helpers'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfWeekLocal(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - d.getDay())
  return d
}

// Builds the full run of Sun-Sat weeks covering the trip once, globally --
// generating them per-month and filtering to overlapping weeks double-renders
// any week that straddles a month boundary (this trip's Sep 27-Oct 3 week
// would otherwise appear under both September and October).
function buildTripWeeks(rangeStart, rangeEnd) {
  const weeks = []
  let cursor = startOfWeekLocal(rangeStart)
  const endBound = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate())
  while (cursor <= endBound) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

// Local (not UTC) date key -- toISOString() would shift the date for users
// west of UTC and mismatch against day.date strings like '2026-09-17'.
function localISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Self-guided walks are split into several "Phase N" activities (each its
// own tab on the day page, for turn-by-turn directions) but should read as
// a single walk on the calendar overview -- collapse them to one chip named
// after the shared prefix (e.g. "Munich Walk: A → B" -> "Munich Walk").
function collapseChips(activities) {
  const chips = []
  const seenGroups = new Set()
  for (const a of activities) {
    const isWalkPhase = /^Phase \d+/i.test(a.tabLabel || '') && a.name.includes(': ')
    if (isWalkPhase) {
      const groupLabel = a.name.split(': ')[0]
      if (seenGroups.has(groupLabel)) continue
      seenGroups.add(groupLabel)
      chips.push({ id: groupLabel, label: groupLabel })
    } else {
      chips.push({ id: a.id, label: a.name })
    }
  }
  return chips
}

function rangeLabel(start, end) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  if (sameMonth) return end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const sameYear = start.getFullYear() === end.getFullYear()
  const startLabel = start.toLocaleDateString('en-US', { month: 'long', year: sameYear ? undefined : 'numeric' })
  const endLabel = end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return `${startLabel} – ${endLabel}`
}

export default function TripCalendar({ days }) {
  if (!days?.length) return null

  const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber)
  const byDate = new Map(sorted.map((d) => [d.date, d]))
  const rangeStart = new Date(sorted[0].date + 'T00:00:00')
  const rangeEnd = new Date(sorted[sorted.length - 1].date + 'T00:00:00')
  const weeks = buildTripWeeks(rangeStart, rangeEnd)

  let seenFirstCell = false

  return (
    <div>
      <h2 className="calendar-month-label">{rangeLabel(rangeStart, rangeEnd)}</h2>
      <div className="calendar-frame">
        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map((w) => (
            <div className="calendar-weekday" key={w}>{w}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div className="calendar-week" key={wi}>
            {week.map((date) => {
              const iso = localISO(date)
              const day = byDate.get(iso)
              const isFirstOfMonth = date.getDate() === 1 && seenFirstCell
              seenFirstCell = true

              if (!day) {
                return (
                  <div className="calendar-cell is-padding" key={iso} aria-hidden="true">
                    <span className="calendar-date">{date.getDate()}</span>
                  </div>
                )
              }

              const slug = resolveDaySlug(day, sorted)
              const city = CITIES[slug]
              const activities = day.activities ?? []

              return (
                <Link
                  key={iso}
                  to={`/day/${day.id}`}
                  className="calendar-cell is-trip-day"
                  style={{ '--city-tint': city.tint, '--city-color': city.color, '--city-text-safe': city.textColor }}
                  aria-label={`${formatDate(day.date)} — ${dayTitle(day)}`}
                >
                  <span className="calendar-date">
                    {isFirstOfMonth
                      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : date.getDate()}
                  </span>
                  {activities.length > 0 && (
                    <span className="calendar-chips">
                      {collapseChips(activities).map((c) => (
                        <span className="calendar-chip" key={c.id}>{c.label}</span>
                      ))}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
