import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useFirestoreCollection } from './hooks/useFirestoreCollection'
import { locationsFromDays } from './data/tripData'
import { RegionProvider } from './context/RegionContext'
import StatusBar from './components/StatusBar'
import TripTimeline from './components/TripTimeline'
import Login from './components/Login'
import ItineraryLanding from './pages/ItineraryLanding'
import LocationPage from './pages/LocationPage'
import ActivityPage from './pages/ActivityPage'
import Settings from './pages/Settings'

function AppShell({ userEmail }) {
  const { items: days } = useFirestoreCollection('days')
  const locations = locationsFromDays(days)

  return (
    <div className="app-shell">
      <StatusBar days={days} />
      <header className="top-bar">
        <div className="top-bar-title-row">
          <Link to="/" className="app-title">Germany + Denmark 2026</Link>
          <Link to="/settings" className="settings-link" aria-label="Settings">⚙</Link>
        </div>
        <TripTimeline locations={locations} />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ItineraryLanding userEmail={userEmail} />} />
          <Route path="/location/:slug" element={<LocationPage userEmail={userEmail} />} />
          <Route path="/activity/:activityId" element={<ActivityPage userEmail={userEmail} />} />
          <Route path="/settings" element={<Settings userEmail={userEmail} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
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
