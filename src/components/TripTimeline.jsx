import { NavLink } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { useRegion } from '../context/RegionContext'

// The app's persistent nav: one equal-width colored segment per region,
// always visible in the header. Active region (by URL match or by a page
// reporting its region via RegionContext, e.g. Activity pages) gets full
// opacity + an underline in its own accent; others dim slightly.
export default function TripTimeline({ locations }) {
  const { region } = useRegion()

  return (
    <div className="trip-timeline" role="list" aria-label="Trip locations">
      {locations.map((loc) => (
        <NavLink
          key={loc.slug}
          to={`/location/${loc.slug}`}
          role="listitem"
          className={({ isActive }) => `trip-timeline-segment${isActive || loc.slug === region ? ' active' : ''}`}
          style={{ '--segment-color': loc.color, '--segment-text': loc.onColor }}
        >
          <span className="trip-timeline-label">{loc.label}</span>
          <span className="trip-timeline-dates">
            {formatDate(loc.dateRange.start)}
            {loc.dateRange.end !== loc.dateRange.start ? ` – ${formatDate(loc.dateRange.end)}` : ''}
          </span>
        </NavLink>
      ))}
    </div>
  )
}
