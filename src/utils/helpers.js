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

// Google Maps' custom URL scheme opens the native iOS/Android app directly.
// Unlike a plain https Universal Link (what mapsSearchUrl produces), this
// also works when the site is running as a standalone Home Screen web app --
// iOS blocks Universal Link handoff to other apps entirely in that context,
// which is how this trip-companion app is meant to be used while traveling.
export function googleMapsAppUrl(query) {
  if (!query) return null
  return `comgooglemaps://?q=${encodeURIComponent(query)}`
}

// Derives an app-scheme URL straight from a Google Maps web link, so every
// existing directionsUrl/startDirectionsUrl/etc. gets native-app handoff for
// free instead of needing a hand-maintained query string per activity --
// pulls the same place text a `maps/search` link carries (`query` or `q`),
// or the plain destination point a `maps/dir` link carries (ignoring
// waypoints -- "get me there" beats no app-handoff at all). Returns null for
// a URL this can't introspect (an opaque maps.app.goo.gl short link, or a
// non-Maps URL like a train-ticket link) unless the caller supplies an
// explicit fallbackQuery for that case.
export function googleMapsAppUrlFromLink(url, fallbackQuery) {
  if (url) {
    try {
      const params = new URL(url).searchParams
      const place = params.get('query') || params.get('q')
      if (place) return googleMapsAppUrl(place)
      const destination = params.get('destination')
      if (destination && /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(destination)) return googleMapsAppUrl(destination)
    } catch {
      // Not an absolute URL Maps would recognize -- fall through to fallbackQuery.
    }
  }
  return googleMapsAppUrl(fallbackQuery)
}

// Tries the native Google Maps app first, falling back to the normal web
// link if it doesn't open within a beat (app not installed, desktop
// browser, or a platform that just ignores the custom scheme). Pass the
// triggering click event so the default <a> navigation can be suppressed
// while this decides which URL actually wins.
export function openGoogleMaps(event, appUrl, webUrl) {
  if (!appUrl || !webUrl) return
  event.preventDefault()
  const fallbackTimer = window.setTimeout(() => {
    window.open(webUrl, '_blank', 'noopener,noreferrer')
  }, 800)
  const cancelFallback = () => window.clearTimeout(fallbackTimer)
  window.addEventListener('pagehide', cancelFallback, { once: true })
  document.addEventListener('visibilitychange', function onVisibilityChange() {
    if (document.hidden) {
      cancelFallback()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  })
  window.location.href = appUrl
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
