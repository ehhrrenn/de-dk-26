import { mapsDirectionsUrl, formatUSD } from '../utils/helpers'
import { useRegion } from '../context/RegionContext'
import Icon from './Icon'

// Compact sticky bar (sits right under the nav) showing the current
// region's stay + a one-tap directions link -- only renders once a page
// has reported an active region via RegionContext (Location/Day pages).
// This is the single lodging UI in the app (no separate detail card on the
// location page) -- it carries the full address, provider/cost, and
// reservation link so nothing's lost by not duplicating it below.
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
          <div className="hotel-icon"><Icon name="building" size={18} /></div>
          <div className="hotel-text">
            <div className="hotel-name">{lodging.name || `Stay in ${location.label}`}</div>
            {lodging.address && <div className="hotel-sub">{lodging.address}</div>}
          </div>
        </div>
        {mapsUrl && (
          <a className="directions-btn" href={mapsUrl} target="_blank" rel="noreferrer">Directions →</a>
        )}
      </div>
      <div className="key-info-meta">
        <span>
          {lodging.provider}
          {lodging.cost ? ` · ${formatUSD(lodging.cost)}` : ''}
          {lodging.checkIn ? ` · Check-in ${lodging.checkIn}` : ''}
          {lodging.checkOut ? ` · Check-out ${lodging.checkOut}` : ''}
          {lodging.link && (
            <>
              {' · '}
              <a href={lodging.link} target="_blank" rel="noreferrer">reservation</a>
            </>
          )}
        </span>
        {next ? <span className="next-chip">Next stop: {next.label} →</span> : <span>Final stop</span>}
      </div>
    </div>
  )
}
