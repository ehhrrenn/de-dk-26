import { mapsDirectionsUrl } from '../utils/helpers'
import { useRegion } from '../context/RegionContext'

// Compact sticky bar (sits right under the nav) showing the current
// region's stay + a one-tap directions link -- only renders once a page
// has reported an active region via RegionContext (Location/Day pages).
export default function KeyInfoBar({ locations }) {
  const { region } = useRegion()
  const index = locations.findIndex((l) => l.slug === region)
  const location = locations[index]

  if (!location || !location.lodging) return null

  const { lodging } = location
  const mapsUrl = mapsDirectionsUrl(lodging.address)
  const next = locations[index + 1]

  return (
    <div className="key-info" style={{
          '--city-color': location.color,
          '--city-on': location.onColor,
          '--city-tint': location.tint,
          '--city-text-safe': location.textColor,
        }}>
      <div className="key-info-row">
        <div className="hotel-block">
          <div className="hotel-icon">🏨</div>
          <div className="hotel-text">
            <div className="hotel-name">{lodging.name || `Stay in ${location.label}`}</div>
            <div className="hotel-sub">{location.label}</div>
          </div>
        </div>
        {mapsUrl && (
          <a className="directions-btn" href={mapsUrl} target="_blank" rel="noreferrer">Directions →</a>
        )}
      </div>
      {(lodging.checkIn || lodging.checkOut || next) && (
        <div className="key-info-meta">
          <span>
            {lodging.checkIn ? `Check-in ${lodging.checkIn}` : ''}
            {lodging.checkOut ? ` · Check-out ${lodging.checkOut}` : ''}
          </span>
          {next ? <span className="next-chip">Next stop: {next.label} →</span> : <span>Final stop</span>}
        </div>
      )}
    </div>
  )
}
