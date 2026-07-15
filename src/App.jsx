import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Nav from './components/Nav'
import Login from './components/Login'
import Timeline from './components/Timeline'
import MapView from './components/MapView'
import Bookings from './components/Bookings'
import Travelers from './components/Travelers'

export default function App() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState('timeline')

  if (loading) return <div className="empty-state">Loading…</div>
  if (!user) return <Login />

  return (
    <div className="app-shell">
      <Header />
      <Nav active={tab} onChange={setTab} />
      <main>
        {tab === 'timeline' && <Timeline userEmail={user.email} />}
        {tab === 'map' && <MapView userEmail={user.email} />}
        {tab === 'bookings' && <Bookings userEmail={user.email} />}
        {tab === 'travelers' && <Travelers userEmail={user.email} />}
      </main>
    </div>
  )
}
