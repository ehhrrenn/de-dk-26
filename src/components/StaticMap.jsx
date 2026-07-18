// Static (non-interactive) map image via the Google Maps Static API.
// Needs VITE_GOOGLE_MAPS_STATIC_KEY (see .env.example / README) -- the key
// is a public client-side identifier by design (restricted by HTTP
// referrer in the Google Cloud console), same pattern as the Firebase
// config.
export default function StaticMap({ center, zoom, markers = [], height = 260, alt }) {
  const params = new URLSearchParams({
    center: `${center[0]},${center[1]}`,
    zoom: String(zoom),
    size: `700x${height}`,
    scale: '2',
    maptype: 'roadmap',
    key: import.meta.env.VITE_GOOGLE_MAPS_STATIC_KEY,
  })
  for (const m of markers) {
    const hex = (m.color || '#F2A93B').replace('#', '0x')
    params.append('markers', `color:${hex}|${m.lat},${m.lon}`)
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
