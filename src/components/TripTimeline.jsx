import { NavLink } from 'react-router-dom'
import { useRegion } from '../context/RegionContext'
import { TRIP } from '../data/tripData'
import { googleMapsAppUrlFromLink, openGoogleMaps } from '../utils/helpers'
import Icon from './Icon'

// The app's persistent nav: a leading calendar icon (links home, where the
// full calendar grid lives), one underline tab per region, and a trailing
// pin icon out to the group's shared Google Maps places list. Active region
// (by URL match or by a page reporting its region via RegionContext) gets a
// colored underline + label; others stay a plain muted tab.
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
      {TRIP.savedPlacesListUrl && (
        <a
          href={TRIP.savedPlacesListUrl}
          target="_blank"
          rel="noreferrer"
          className="trip-timeline-pin"
          aria-label="Shared places list"
          title="Shared places list"
          onClick={(e) => openGoogleMaps(e, googleMapsAppUrlFromLink(TRIP.savedPlacesListUrl), TRIP.savedPlacesListUrl)}
        >
          <Icon name="pin" size={18} />
        </a>
      )}
    </nav>
  )
}
