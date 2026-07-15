import { NavLink, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const onItinerary = pathname === '/' || pathname.startsWith('/location') || pathname.startsWith('/activity')

  return (
    <nav className="tabs" role="tablist" aria-label="Trip sections">
      <NavLink to="/" role="tab" aria-selected={onItinerary} className={`tab${onItinerary ? ' active' : ''}`}>
        Itinerary
      </NavLink>
      <NavLink to="/bookings" role="tab" className={({ isActive }) => `tab${isActive ? ' active' : ''}`} aria-selected={pathname === '/bookings'}>
        Bookings
      </NavLink>
      <NavLink to="/travelers" role="tab" className={({ isActive }) => `tab${isActive ? ' active' : ''}`} aria-selected={pathname === '/travelers'}>
        Travelers
      </NavLink>
    </nav>
  )
}
