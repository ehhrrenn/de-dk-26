import { NavLink } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'

// The app's persistent nav: one underline tab per region. Active region (by
// URL match or by a page reporting its region via RegionContext) gets a
// colored underline + label; others stay a plain muted tab.
export default function TripTimeline({ locations }) {
  const { region } = useRegion()

  return (
    <nav className="trip-timeline" aria-label="Trip locations">
      {locations.map((loc) => (
        <NavLink
          key={loc.slug}
          to={`/location/${loc.slug}`}
          className={({ isActive }) => `trip-timeline-segment${isActive || loc.slug === region ? ' active' : ''}`}
          style={{ '--segment-color': loc.color, '--segment-text-safe': loc.textColor }}
        >
          {loc.label}
        </NavLink>
      ))}
    </nav>
  )
}
