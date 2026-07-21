// Static (non-interactive) map image via the Google Maps Static API.
// Needs VITE_GOOGLE_MAPS_STATIC_KEY (see .env.example / README) -- the key
// is a public client-side identifier by design (restricted by HTTP
// referrer in the Google Cloud console), same pattern as the Firebase
// config.
//
// `center`/`zoom` are optional: pass a `path` (an ordered list of
// [lat, lon] points, e.g. from parseDirectionsUrl) instead, and Google
// auto-fits the viewport to the route -- same trick works for `markers`
// alone if there's more than one.
export default function StaticMap({ center, zoom, markers = [], path, height = 260, alt }) {
  const params = new URLSearchParams({
    size: `700x${height}`,
    scale: '2',
    maptype: 'roadmap',
    key: import.meta.env.VITE_GOOGLE_MAPS_STATIC_KEY,
  })
  if (center) params.set('center', `${center[0]},${center[1]}`)
  if (zoom != null) params.set('zoom', String(zoom))
  for (const m of markers) {
    const hex = (m.color || '#F2A93B').replace('#', '0x')
    // Markers can be plotted either by coordinates or, when we only know a
    // place's name, by a query string -- Google's static-map geocoder
    // resolves the location server-side either way.
    const location = m.query || `${m.lat},${m.lon}`
    params.append('markers', `color:${hex}|${location}`)
  }
  if (path?.points?.length > 1) {
    const hex = (path.color || '#F2A93B').replace('#', '0x')
    const points = path.points.map(([lat, lon]) => `${lat},${lon}`).join('|')
    params.append('path', `color:${hex}|weight:4|${points}`)
  }
  const src = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`

  return (
    <div className="map-frame">
      <img
        src={src}
        alt={alt}
        width={700}
        height={height}
        style={{ width: '100%', height, objectFit: 'cover', display: 'block' }}
        loading="lazy"
      />
    </div>
  )
}
