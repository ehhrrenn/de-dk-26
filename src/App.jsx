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
import blakePhoto from './assets/faces/blake.png'
import myraPhoto from './assets/faces/myra.png'
import selenaPhoto from './assets/faces/selena.png'

function AppShell({ userEmail }) {
  const { items: days } = useFirestoreCollection('days')
  const locations = locationsFromDays(days)
  const status = days.length ? dayStatus(days) : null

  return (
    <div className="app">
      <div className="header">
        <Link to="/" className="app-title-link">
          <div className="header-row">
            <div className="header-faces header-faces-left">
              <img src={blakePhoto} alt="Blake" className="header-face header-face-blake" />
              <img src={myraPhoto} alt="Myra" className="header-face header-face-myra" />
            </div>
            <div className="header-text">
              <span className="header-eyebrow">Blake and Myra&rsquo;s 40th Birthday</span>
              <h1 className="header-serif">Oktoberfest &amp; Copenhagen</h1>
              <span className="header-footnote">and also Selena&rsquo;s actual birthday</span>
            </div>
            <div className="header-faces header-faces-right">
              <img src={selenaPhoto} alt="Selena" className="header-face header-face-selena" />
            </div>
          </div>
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

      <main>
        <Routes>
          <Route path="/" element={<ItineraryLanding userEmail={userEmail} />} />
          <Route path="/location/:slug" element={<LocationPage userEmail={userEmail} />} />
          <Route path="/day/:dayId" element={<DayPage userEmail={userEmail} />} />
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
