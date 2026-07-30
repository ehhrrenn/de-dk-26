import { NavLink } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'
import Icon from './Icon'

// The app's persistent nav: a leading calendar icon (links home, where the
// full calendar grid lives) followed by one underline tab per region.
// Active region (by URL match or by a page reporting its region via
// RegionContext) gets a colored underline + label; others stay a plain
// muted tab.
export default function TripTimeline({ locations }) {
  const { region } = useRegion()

  return (
    <nav className="trip-timeline" aria-label="Trip locations">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `trip-timeline-calendar${isActive ? ' active' : ''}`}
        aria-label="Calendar"
        title="Calendar"
      >
        <Icon name="calendar" size={18} />
      </NavLink>
      {locations.map((loc) => (
        <NavLink
          key={loc.slug}
          to={`/location/${loc.slug}`}
          className={({ isActive }) => `trip-timeline-segment${isActive || loc.slug === region ? ' active' : ''}`}
          style={{ '--segment-color': loc.color, '--segment-text-safe': loc.textColor }}
          title={loc.label}
        >
          {loc.shortLabel || loc.label}
        </NavLink>
      ))}
    </nav>
  )
}
