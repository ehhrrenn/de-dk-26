import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { RegionProvider } from './context/RegionContext'
import { HomeStatusProvider, useHomeStatusDays } from './context/HomeStatusContext'
import RegionPills from './components/RegionPills'
import StatusBar from './components/StatusBar'
import Login from './components/Login'
import ItineraryLanding from './pages/ItineraryLanding'
import LocationPage from './pages/LocationPage'
import DayPage from './pages/DayPage'
import ActivityPage from './pages/ActivityPage'
import Settings from './pages/Settings'

function AppShell({ userEmail }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const homeDays = useHomeStatusDays()

  return (
    <div className="app-shell">
      {isHome && (
        <>
          <StatusBar days={homeDays} />
          <header className="top-bar">
            <RegionPills />
          </header>
        </>
      )}
      <main>
        <Routes>
          <Route path="/" element={<ItineraryLanding userEmail={userEmail} />} />
          <Route path="/location/:slug" element={<LocationPage userEmail={userEmail} />} />
          <Route path="/day/:dayId" element={<DayPage userEmail={userEmail} />} />
          <Route path="/activity/:activityId" element={<ActivityPage userEmail={userEmail} />} />
          <Route path="/settings" element={<Settings userEmail={userEmail} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isHome && (
        <nav className="bottom-nav">
          <RegionPills />
        </nav>
      )}
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="empty-state">Loading…</div>
  if (!user) return <Login />

  return (
    <RegionProvider>
      <HomeStatusProvider>
        <AppShell userEmail={user.email} />
      </HomeStatusProvider>
    </RegionProvider>
  )
}
