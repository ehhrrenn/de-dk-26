// Static (non-interactive) OpenStreetMap tile image -- no API key needed,
// via the free staticmap.openstreetmap.de rendering service. Trades
// interactivity for a lightweight, always-consistent map panel.
export default function StaticMap({ center, zoom, markers = [], height = 260, alt }) {
  const params = new URLSearchParams({
    center: `${center[0]},${center[1]}`,
    zoom: String(zoom),
    size: `700x${height}`,
    maptype: 'mapnik',
  })
  for (const m of markers) {
    params.append('markers', `${m.lat},${m.lon},${m.color || 'red'}`)
  }
  const src = `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
