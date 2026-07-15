import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'

// Simple graphic timeline: one colored segment per major location, width
// proportional to how many days are spent there, in trip order.
export default function TripTimeline({ locations }) {
  return (
    <div className="trip-timeline" role="list" aria-label="Trip locations">
      {locations.map((loc) => (
        <Link
          key={loc.slug}
          to={`/location/${loc.slug}`}
          role="listitem"
          className="trip-timeline-segment"
          style={{ '--segment-color': loc.color, flexGrow: loc.days.length }}
        >
          <span className="trip-timeline-label">{loc.label}</span>
          <span className="trip-timeline-dates">
            {formatDate(loc.dateRange.start)}
            {loc.dateRange.end !== loc.dateRange.start ? ` – ${formatDate(loc.dateRange.end)}` : ''}
          </span>
        </Link>
      ))}
    </div>
  )
}
