---
name: firebase
description: How Firebase (Firestore) is wired up in this trip-itinerary app, and how to safely extend it. Use this whenever a task touches firestore.rules, src/firebase.js, VITE_FIREBASE_* env vars, adding a new Firestore-backed collection, or running `firebase deploy`/`firebase-tools` — even if the user just says something like "let's add a notes collection" without mentioning Firebase by name.
---

# Firebase in this repo

This app is a static React/Vite site deployed to **Firebase Hosting**
(live site on merge to `main`, a preview channel URL for every pull
request) that also uses **Firestore** (the shared, live-synced trip
data). `firebase.json` declares both `firestore.rules` and the
`hosting` block (serves `dist`, SPA rewrite to `/index.html`).

## Where things live

| File | Role |
|---|---|
| `src/firebase.js` | Initializes the app, exports `app`, `db` |
| `src/hooks/useFirestoreCollection.js` | Realtime `onSnapshot` wrapper used by every page that reads/writes Firestore — gives `{ items, loading, error, add, update, remove }` |
| `firestore.rules` | Access rules (see below — currently wide open) |
| `firebase.json` | `firestore.rules` path + `hosting` config (public dir `dist`, SPA rewrite) |
| `.env.example` / `.env.local` | `VITE_FIREBASE_*` config values + `VITE_GOOGLE_MAPS_STATIC_KEY` |
| `.github/workflows/firebase-hosting-pull-request.yml` | Builds and deploys a PR preview channel on every `pull_request` event |
| `.github/workflows/firebase-hosting-merge.yml` | Builds and deploys to the live channel on push to `main` |

Because Hosting serves from the domain root (not a GitHub Pages-style
subpath), `vite.config.js` has no `base` override — don't add one back
without checking whether the deploy target still needs it.

## The access-control model — read this before touching auth

**There is no auth and no access control.** This app was previously
gated behind Google sign-in + a Firestore `/allowlist` collection; that
was deliberately removed so the site is fully public. `firestore.rules`
now allows `read, write: if true` on every collection it declares.

**Implication for you as an agent:** don't reintroduce sign-in, an
allowlist, or any per-user gating unless the user explicitly asks for
it — that's a real, deliberate product decision, not an oversight to
"fix." If a task seems to call for restricting who can see or edit
something, flag it rather than assuming; it means bringing auth back
partially or fully, which is a meaningful change.

Because the site is open, **never store sensitive personal data**
(passport numbers, DOB, government IDs, financial account numbers,
etc.) in any Firestore collection here. If a task asks you to add a
field like that, push back and confirm that's really intended given
everything here is public.

## Firestore collections currently in use

- `days` — the itinerary, seeded from `src/data/tripData.js` on first load (see `ItineraryLanding.jsx`), `allow read, write: if true;` in `firestore.rules`

## Adding a new Firestore-backed collection

Follow the existing pattern rather than inventing a new one:

1. **In `firestore.rules`**, add a new `match /yourCollection/{id} { allow read, write: if true; }` block (mirror the `days` block). Don't forget rules only take effect once deployed (see below) — editing the file alone does nothing in production.
2. **In a component/page**, call `useFirestoreCollection('yourCollection')` to get `{ items, loading, error, add, update, remove }` — this hook already handles realtime sync, so there's normally no need to write raw `firebase/firestore` calls.
3. Remember the "no sensitive data" rule above applies to whatever you add too — this is a public, unauthenticated site.

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
are **not secrets** — the Firebase web config is meant to be public.
`VITE_GOOGLE_MAPS_STATIC_KEY` is the one value here that should be
restricted (HTTP-referrer restriction in Google Cloud console), but it's
still a normal client-side value once restricted, not something to keep
out of the built bundle.

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
section for the one-time setup steps. If PR previews stop posting or start
failing, check that secret before assuming the workflow YAML is wrong.
