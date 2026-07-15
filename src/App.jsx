import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Nav from './components/Nav'
import Login from './components/Login'
import ItineraryLanding from './pages/ItineraryLanding'
import LocationPage from './pages/LocationPage'
import ActivityPage from './pages/ActivityPage'
import Bookings from './components/Bookings'
import Travelers from './components/Travelers'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="empty-state">Loading…</div>
  if (!user) return <Login />

  return (
    <div className="app-shell">
      <Header />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<ItineraryLanding userEmail={user.email} />} />
          <Route path="/location/:slug" element={<LocationPage userEmail={user.email} />} />
          <Route path="/activity/:activityId" element={<ActivityPage userEmail={user.email} />} />
          <Route path="/bookings" element={<Bookings userEmail={user.email} />} />
          <Route path="/travelers" element={<Travelers userEmail={user.email} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
