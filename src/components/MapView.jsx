import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker } from 'react-leaflet'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { CITIES, cityFor } from '../data/cities'
import NotAuthorized from './NotAuthorized'

export default function MapView({ userEmail }) {
  const { items, loading, error } = useFirestoreCollection('days')

  if (error) return <NotAuthorized email={userEmail} />
  if (loading) return <div className="empty-state">Loading map…</div>

  const days = [...items].sort((a, b) => a.dayNumber - b.dayNumber).filter((d) => d.coords)
  if (days.length === 0) {
    return <div className="empty-state">No located days yet — import the itinerary on the Timeline tab first.</div>
  }

  const route = days.map((d) => d.coords)
  const center = days[Math.floor(days.length / 2)].coords

  return (
    <div>
      <h1 className="section-heading">Route</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <MapContainer center={center} zoom={6} style={{ height: '60vh', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={route} pathOptions={{ color: '#f2a93b', weight: 2, dashArray: '4 6' }} />
          {days.map((d) => {
            const city = CITIES[cityFor(d.isTravelDay ? d.cityNight : d.cityDay)]
            return (
              <CircleMarker
                key={d.id}
                center={d.coords}
                radius={8}
                pathOptions={{ color: city.color, fillColor: city.color, fillOpacity: 0.85, weight: 2 }}
              >
                <Popup>
                  <strong>Day {d.dayNumber}</strong> · {d.isTravelDay ? `${d.cityDay} → ${d.cityNight}` : d.cityDay}
                  {d.activity?.name && <div>{d.activity.emoji} {d.activity.name}</div>}
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      <div className="card" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12 }}>
        {Object.values(CITIES).filter((c) => c.label !== 'In transit').map((c) => (
          <span key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
