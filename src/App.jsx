import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useFirestoreCollection } from './hooks/useFirestoreCollection'
import { locationsFromDays } from './data/tripData'
import { dayStatus } from './utils/helpers'
import { RegionProvider } from './context/RegionContext'
import TripTimeline from './components/TripTimeline'
import KeyInfoBar from './components/KeyInfoBar'
import Icon from './components/Icon'
import Login from './components/Login'
import ItineraryLanding from './pages/ItineraryLanding'
import LocationPage from './pages/LocationPage'
import DayPage from './pages/DayPage'
import Settings from './pages/Settings'

function AppShell({ userEmail }) {
  const { items: days } = useFirestoreCollection('days')
  const locations = locationsFromDays(days)
  const status = days.length ? dayStatus(days) : null

  return (
    <div className="app">
      <div className="header">
        <Link to="/" className="app-title-link">
          <h1>Germany + Denmark 2026</h1>
        </Link>
        <div className="header-status">
          {status && <span className="status-label">{status.label}</span>}
          <Link to="/settings" className="settings-link" aria-label="Settings">
            <Icon name="settings" size={16} />
          </Link>
        </div>
      </div>

      <div className="sticky-wrap">
        <TripTimeline locations={locations} />
        <KeyInfoBar locations={locations} />
      </div>

      <Routes>
        <Route path="/" element={<ItineraryLanding userEmail={userEmail} />} />
        <Route path="/location/:slug" element={<LocationPage userEmail={userEmail} />} />
        <Route path="/day/:dayId" element={<DayPage userEmail={userEmail} />} />
        <Route path="/settings" element={<Settings userEmail={userEmail} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="empty-state">Loading…</div>
  if (!user) return <Login />

  return (
    <RegionProvider>
      <AppShell userEmail={user.email} />
    </RegionProvider>
  )
}
