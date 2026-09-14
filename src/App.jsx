import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useFirestoreCollection } from './hooks/useFirestoreCollection'
import { locationsFromDays } from './data/tripData'
import { dayStatus } from './utils/helpers'
import { RegionProvider } from './context/RegionContext'
import TripTimeline from './components/TripTimeline'
import KeyInfoBar from './components/KeyInfoBar'
import ItineraryLanding from './pages/ItineraryLanding'
import LocationPage from './pages/LocationPage'
import DayPage from './pages/DayPage'
import blakePhoto from './assets/faces/blake.png'
import myraPhoto from './assets/faces/myra.png'
import selenaPhoto from './assets/faces/selena.png'

function AppShell() {
  const { items: days } = useFirestoreCollection('days')
  const locations = locationsFromDays(days)
  const status = days.length ? dayStatus(days) : null

  const stickySentinelRef = useRef(null)
  const [stickyStuck, setStickyStuck] = useState(false)

  useEffect(() => {
    const sentinel = stickySentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setStickyStuck(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

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
        </div>
      </div>

      {/* A zero-height sentinel is unreliable for IntersectionObserver on
          some WebKit builds (intersection ratio for a zero-area target is
          ill-defined) -- give it 1px so "stuck" is detected the instant
          .sticky-wrap actually pins, not several scroll-frames later. */}
      <div ref={stickySentinelRef} style={{ height: 1 }} aria-hidden="true" />
      <div className={`sticky-wrap${stickyStuck ? ' is-stuck' : ''}`}>
        <TripTimeline locations={locations} />
        <KeyInfoBar locations={locations} />
      </div>

      <main>
        <Routes>
          <Route path="/" element={<ItineraryLanding />} />
          <Route path="/location/:slug" element={<LocationPage />} />
          <Route path="/day/:dayId" element={<DayPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <RegionProvider>
      <AppShell />
    </RegionProvider>
  )
}
