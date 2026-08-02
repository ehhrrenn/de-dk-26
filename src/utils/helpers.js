export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// Compact numeric form (e.g. "9/17") for the day-detail badge, where a
// short date reads better than the sequential trip-day count.
export function formatShortDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// The subtitle shown next to a day's date badge -- the day's activity
// categories (Travel, Tour, Festival, ...), deduped, or "Free day" when
// nothing's scheduled yet. Shared by LocationPage's itinerary rows and
// DayPage's header so both read the same way.
export function categorySummary(activities = []) {
  const categories = [...new Set(activities.map((a) => a.category).filter(Boolean))]
  return categories.length ? categories.join(' + ') : 'Free day'
}

// The headline shown for a day -- its own `title` override if set, its
// travel route, its activity name(s), or "Free day". Shared by
// LocationPage's itinerary rows and DayPage's header so both read the same
// way. The override exists for days whose activities have short/generic
// names (e.g. multi-phase tabs) that would otherwise concatenate into an
// unreadable header.
export function dayTitle(day) {
  if (day.title) return day.title
  if (day.isTravelDay) return `${day.cityDay} → ${day.cityNight}`
  const names = (day.activities ?? []).map((a) => a.name).join(' + ')
  return names || 'Free day'
}

export function dayStatus(days) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const first = new Date(days[0].date + 'T00:00:00')
  const last = new Date(days[days.length - 1].date + 'T00:00:00')

  if (today < first) {
    const diffDays = Math.ceil((first - today) / 86400000)
    return { phase: 'before', label: `T-MINUS ${diffDays} DAY${diffDays === 1 ? '' : 'S'}` }
  }
  if (today > last) {
    return { phase: 'after', label: 'TRIP COMPLETE' }
  }
  const current = days.find((d) => d.date === today.toISOString().slice(0, 10))
  if (current) {
    return { phase: 'during', label: `DAY ${current.dayNumber} · ${current.cityDay.toUpperCase()}`, current }
  }
  return { phase: 'during', label: 'ON THE ROAD' }
}

export function formatUSD(n) {
  if (n == null) return '—'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// Opens a place's Google Maps search/info page (not the Directions panel) --
// derived (never stored) so it can't drift from the address it's built from.
// Deliberately not a /dir/ URL: pin-only links are what every "get to"
// button in this app uses, so users land on the actual place (photos,
// reviews) instead of a preloaded route from an assumed "current location."
export function mapsSearchUrl(query) {
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Pulls the ordered lat/lon points (origin, waypoints, destination) back
// out of one of our "…/maps/dir/?api=1&origin=…&waypoints=…" URLs, so the
// day-detail map can draw the actual route instead of a single pin.
export function parseDirectionsUrl(url) {
  if (!url) return null
  try {
    const params = new URL(url).searchParams
    const origin = params.get('origin')
    const destination = params.get('destination')
    const waypoints = params.get('waypoints')
    if (!origin) return null
    // Only real "lat,lon" pairs parse into a point -- an address string (used
    // for some directionsUrl entries where we only have a place name, not
    // coordinates) would otherwise silently produce NaN and draw a broken map.
    const toPoint = (s) => {
      const [lat, lon] = s.split(',').map(Number)
      return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null
    }
    const points = [toPoint(origin)]
    if (waypoints) points.push(...waypoints.split('|').map(toPoint))
    if (destination) points.push(toPoint(destination))
    if (points.some((p) => p === null)) return null
    return points.length > 1 ? points : null
  } catch {
    return null
  }
}

// A single point representing where an activity actually happens -- the
// destination of its directions link (not the route's turn-by-turn
// waypoints, which are only useful when viewing that one route) or, for
// activities we only know by name, a text query Google's static-map
// geocoder can resolve. Returns null for activities with no map-able
// location (e.g. a flight or a train-booking link).
export function activityLocation(activity) {
  const url = activity?.directionsUrl
  if (!url) return null
  try {
    const params = new URL(url).searchParams
    const destination = params.get('destination')
    if (destination) {
      const [lat, lon] = destination.split(',').map(Number)
      return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null
    }
    const query = params.get('query')
    return query ? { query } : null
  } catch {
    return null
  }
}
