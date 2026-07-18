import { useState } from 'react'
import { signIn } from '../firebase'

function loginErrorMessage(err) {
  if (err?.code === 'auth/unauthorized-domain') {
    return "This site's domain isn't authorized for sign-in yet. If you're on a PR preview link, ask an admin to add it under Firebase Console → Authentication → Settings → Authorized domains."
  }
  if (err?.code === 'auth/popup-blocked') {
    return 'Your browser blocked the sign-in popup. Allow popups for this site and try again.'
  }
  if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
    return null
  }
  return 'Sign-in failed. Please try again.'
}

export default function Login() {
  const [error, setError] = useState(null)

  return (
    <div className="center-screen">
      <p className="muted mono" style={{ margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Munich → Rhine Valley → Berlin → Copenhagen
      </p>
      <h1 className="section-heading" style={{ margin: 0 }}>DE + DK 2026</h1>
      <p className="muted" style={{ maxWidth: 320 }}>
        Sign in with the Google account you're traveling with to view and edit the shared itinerary.
      </p>
      <button
        className="btn primary"
        onClick={() => {
          setError(null)
          signIn().catch((err) => {
            console.error(err)
            setError(loginErrorMessage(err))
          })
        }}
      >
        Sign in with Google
      </button>
      {error && (
        <p className="muted" style={{ maxWidth: 320 }}>
          {error}
        </p>
      )}
    </div>
  )
}
