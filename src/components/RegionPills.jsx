import { NavLink, Link } from 'react-router-dom'
import { CITIES } from '../data/cities'
import { useRegion } from '../context/RegionContext'

// The app's only navigation: one pill per region, plus a small settings
// link. Rendered as a sticky header on the home page and a sticky bottom
// nav everywhere else -- the wrapping element is supplied by the caller.
export default function RegionPills() {
  const { region } = useRegion()

  return (
    <nav className="region-pills" aria-label="Trip regions">
      {Object.entries(CITIES)
        .filter(([slug]) => slug !== 'transit')
        .map(([slug, city]) => (
          <NavLink
            key={slug}
            to={`/location/${slug}`}
            className={({ isActive }) => `region-pill${isActive || slug === region ? ' active' : ''}`}
            style={{ '--city-color': city.color, '--city-text': city.onColor }}
          >
            {city.label}
          </NavLink>
        ))}
      <Link to="/settings" className="settings-link" aria-label="Settings">⚙</Link>
    </nav>
  )
}
