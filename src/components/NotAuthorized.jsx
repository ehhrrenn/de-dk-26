import { signOutUser } from '../firebase'

export default function NotAuthorized({ email }) {
  return (
    <div className="center-screen">
      <h1 className="section-heading" style={{ margin: 0 }}>Not on the list yet</h1>
      <p className="muted" style={{ maxWidth: 340 }}>
        <span className="mono">{email}</span> isn't in the trip's allowlist yet. Ask whoever set up
        the Firebase project to add this email under the <span className="mono">allowlist</span>{' '}
        collection in Firestore.
      </p>
      <button className="btn" onClick={() => signOutUser()}>Sign out</button>
    </div>
  )
}
