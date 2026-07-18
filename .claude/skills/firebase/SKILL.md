---
name: firebase
description: How Firebase (Auth + Firestore) is wired up in this trip-itinerary app, and how to safely extend it. Use this whenever a task touches firestore.rules, the /allowlist collection, sign-in/permission-denied errors, src/firebase.js, VITE_FIREBASE_* env vars, adding a new Firestore-backed collection, or running `firebase deploy`/`firebase-tools` — even if the user just says something like "let's add a notes collection" or "why am I getting permission-denied" without mentioning Firebase by name.
---

# Firebase in this repo

This app is a static React/Vite site deployed to **Firebase Hosting**
(live site on merge to `main`, a preview channel URL for every pull
request) that also uses Firebase for **Auth** (Google sign-in) and
**Firestore** (the shared, live-synced trip data). `firebase.json`
declares both `firestore.rules` and the `hosting` block (serves `dist`,
SPA rewrite to `/index.html`).

## Where things live

| File | Role |
|---|---|
| `src/firebase.js` | Initializes the app, exports `auth`, `db`, `signIn()`, `signOutUser()` |
| `src/hooks/useAuth.js` | `onAuthStateChanged` wrapper — gives `{ user, loading }` |
| `src/hooks/useFirestoreCollection.js` | Realtime `onSnapshot` wrapper used by every page that reads/writes Firestore — gives `{ items, loading, error, add, update, remove }` |
| `firestore.rules` | The **only** place access control is enforced (see below) |
| `firebase.json` | `firestore.rules` path + `hosting` config (public dir `dist`, SPA rewrite) |
| `.env.example` / `.env.local` | `VITE_FIREBASE_*` config values + `VITE_GOOGLE_MAPS_STATIC_KEY` |
| `.github/workflows/firebase-hosting-pull-request.yml` | Builds and deploys a PR preview channel on every `pull_request` event |
| `.github/workflows/firebase-hosting-merge.yml` | Builds and deploys to the live channel on push to `main` |

Because Hosting serves from the domain root (not a GitHub Pages-style
subpath), `vite.config.js` has no `base` override — don't add one back
without checking whether the deploy target still needs it.

## The access-control model — read this before touching auth

Access control is **data, not code**. There is exactly one mechanism:

1. A user signs in with Google (`signIn()` in `src/firebase.js`, via `signInWithPopup`).
2. `firestore.rules` defines `isMember()`, which checks whether a document
   whose ID is the signed-in user's exact email exists under
   `/allowlist/{email}`.
3. Every other collection's rule is just `allow read, write: if isMember();`.
4. The `/allowlist` collection itself is `allow read, write: if false` —
   nobody can read it client-side. `isMember()` still works because
   Firestore's `exists()` check doesn't require read access to the document.

**Implication for you as an agent:** never try to implement "who can see
this" logic in app code (React components, hooks, JS conditionals). It
belongs in `firestore.rules`, full stop — adding people happens by creating
a doc under `/allowlist` in the Firestore console, not by editing this repo.

If someone reports "permission-denied" after signing in, the near-universal
cause is: their email isn't in `/allowlist` yet. `useFirestoreCollection.js`
already comments this. Don't go chasing rule bugs first — check the
allowlist assumption before anything else.

## Firestore collections currently in use

All of these are gated by the same `isMember()` check in `firestore.rules`:

- `allowlist` — write-protected doc-per-email, existence-only, never read directly
- `days` — the itinerary, seeded from `src/data/tripData.js` on first load (see `ItineraryLanding.jsx`)
- `bookings` — day-scoped bookings, used in `src/pages/Settings.jsx` via `useFirestoreCollection('bookings')`
- `travelers` — traveler info including sensitive fields (passport numbers, DOB), used in `src/pages/Settings.jsx` via `useFirestoreCollection('travelers')`

## Adding a new Firestore-backed collection

Follow the existing pattern rather than inventing a new one:

1. **In `firestore.rules`**, add a new `match /yourCollection/{id} { allow read, write: if isMember(); }` block (mirror the `bookings`/`travelers` blocks). Don't forget rules only take effect once deployed (see below) — editing the file alone does nothing in production.
2. **In a component/page**, call `useFirestoreCollection('yourCollection')` to get `{ items, loading, error, add, update, remove }` — this hook already handles realtime sync and the permission-denied case, so there's normally no need to write raw `firebase/firestore` calls.
3. If the collection needs a more restrictive rule than "any allowlisted member can read/write everything" (e.g. a traveler editing only their own record), that's a deliberate rules change — flag it rather than silently keeping the blanket `isMember()` rule, since `firestore.rules` currently comments that `travelers` was split out specifically so this could be tightened later.

## Deploying rule changes

Editing `firestore.rules` in the repo does **not** change production
behavior until deployed. Two ways:

```bash
npm install -g firebase-tools   # once
firebase login
firebase use --add              # pick the Firebase project, once per clone
firebase deploy --only firestore:rules
```

Or paste the file contents into Firestore Database → Rules in the console
and click Publish. Mention this deploy step explicitly whenever you change
`firestore.rules` — don't let it look like the change is "done" once the
file is edited.

## Env vars

Three places need to stay in sync whenever a Firebase-related env var is
added, renamed, or removed:

1. **`.env.example`** (documents the var for local dev — copied to `.env.local`, which is gitignored)
2. **`.github/workflows/firebase-hosting-pull-request.yml`** and **`firebase-hosting-merge.yml`** (both map a GitHub Actions repo secret of the same name into the build's `env:` block — they build independently, so update both or previews and production will diverge)

`src/firebase.js` reads them via `import.meta.env.VITE_FIREBASE_*` (Vite
requires the `VITE_` prefix to expose a var to client code). These values
are **not secrets** — the Firebase web config is meant to be public, real
security is entirely in `firestore.rules`. `VITE_GOOGLE_MAPS_STATIC_KEY` is
the one value here that should be restricted (HTTP-referrer restriction in
Google Cloud console), but it's still a normal client-side value once
restricted, not something to keep out of the built bundle.

When adding a brand new Firebase-adjacent env var, update all of:
`.env.example`, both workflows' `env:` blocks, and the code that reads
`import.meta.env.VITE_YOUR_VAR` — plus tell the user they need to add the
matching GitHub Actions repository secret themselves (you can't create
repo secrets).

## Hosting deploys (production + PR previews)

Both workflows use `FirebaseExtended/action-hosting-deploy@v0`, authenticated
via a `FIREBASE_SERVICE_ACCOUNT` repo secret (a service account JSON key with
the Firebase Hosting Admin role — not the same secret family as the
`VITE_FIREBASE_*` client config values). See the README's Firebase Hosting
section for the one-time setup steps. If PR previews stop posting a URL or
start failing auth, check that secret before assuming the workflow YAML is
wrong.
