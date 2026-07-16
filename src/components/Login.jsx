import { signIn } from '../firebase'

export default function Login() {
  return (
    <div className="center-screen">
      <p className="muted mono" style={{ margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Munich → Rhine Valley → Berlin → Copenhagen
      </p>
      <h1 className="section-heading" style={{ margin: 0 }}>DE + DK 2026</h1>
      <p className="muted" style={{ maxWidth: 320 }}>
        Sign in with the Google account you're traveling with to view and edit the shared itinerary.
      </p>
      <button className="btn primary" onClick={() => signIn().catch(console.error)}>
        Sign in with Google
      </button>
    </div>
  )
}
