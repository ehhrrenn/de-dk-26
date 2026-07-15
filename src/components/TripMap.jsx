import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker } from 'react-leaflet'
import { CITIES, cityFor } from '../data/cities'

// Pure presentational trip map -- takes already-loaded `days`, no data
// fetching of its own (callers already hold the Firestore data).
// Unscoped (no highlightSlug): whole-trip route, markers navigate to their
// location page on click. Scoped (highlightSlug set, used by LocationPage):
// centers/zooms on that location and dims markers from other locations.
export default function TripMap({ days, highlightSlug }) {
  const navigate = useNavigate()
  const located = [...days].sort((a, b) => a.dayNumber - b.dayNumber).filter((d) => d.coords)

  if (located.length === 0) return null

  const route = located.map((d) => d.coords)
  const highlight = highlightSlug && CITIES[highlightSlug]
  const center = highlight?.coords ?? located[Math.floor(located.length / 2)].coords
  const zoom = highlight ? 11 : 6

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '48vh', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={route} pathOptions={{ color: '#f2a93b', weight: 2, dashArray: '4 6' }} />
        {located.map((d) => {
          const slug = cityFor(d.isTravelDay ? d.cityNight : d.cityDay)
          const city = CITIES[slug]
          const dimmed = highlightSlug && slug !== highlightSlug
          return (
            <CircleMarker
              key={d.id}
              center={d.coords}
              radius={dimmed ? 5 : 8}
              pathOptions={{ color: city.color, fillColor: city.color, fillOpacity: dimmed ? 0.25 : 0.85, weight: 2 }}
              eventHandlers={!highlightSlug ? { click: () => navigate(`/location/${slug}`) } : undefined}
            >
              <Popup>
                <strong>Day {d.dayNumber}</strong> · {d.isTravelDay ? `${d.cityDay} → ${d.cityNight}` : d.cityDay}
                {d.activities?.[0]?.name && <div>{d.activities[0].emoji} {d.activities[0].name}</div>}
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
