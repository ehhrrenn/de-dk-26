# DE + DK 2026

Shared itinerary app for the Germany + Denmark trip (Sept 17 – Oct 1, 2026).
React (Vite) frontend on GitHub Pages, Firebase (Auth + Firestore) for
shared, live-editable data.

## 1. Create the Firebase project

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable.**
3. **Build → Firestore Database → Create database** (production mode, pick any region — pick one close to your group).
4. **Project settings → General → Your apps → Web (</>)** → register an app (no hosting needed). Copy the `firebaseConfig` values.

## 2. Get a Google Maps Static API key

Used to render the trip route/location map images.

1. [console.cloud.google.com](https://console.cloud.google.com) → create or pick a project → **billing must be enabled** on it (a card on file — Google requires this for a production key even though this app's traffic will realistically stay within the free 10,000 map-loads/month tier; static maps are $2 per 1,000 loads after that).
2. **APIs & Services → Library** → enable **Maps Static API**.
3. **APIs & Services → Credentials → Create credentials → API key.**
4. Click the new key → **Application restrictions → Websites** → add your GitHub Pages origin (`https://<you>.github.io/*`) and, for local dev, `http://localhost:*`. This is what keeps the key safe to ship in client-side code.

## 3. Add your group to the allowlist

Access control lives entirely in Firestore data, never in code:

- Firestore Database → **Start collection** → collection ID `allowlist`.
- Add one document per traveler, **document ID = their exact Google email**
  (e.g. `alex@gmail.com`). The document's fields don't matter — its
  existence is what grants access. A single field like `name: "Alex"` is fine.

Add/remove people any time without touching code or redeploying.

## 4. Deploy the Firestore security rules

Rules in `firestore.rules` restrict all reads/writes to emails present in
`/allowlist`. Deploy them with the [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick your project
firebase deploy --only firestore:rules
```

(Or paste the contents of `firestore.rules` into Firestore Database →
Rules in the console and click Publish.)

## 5. Local development

```bash
npm install
cp .env.example .env.local  # fill in the firebaseConfig values (step 1) and the maps key (step 2)
npm run dev
```

Sign in and visit the home page once — it automatically pushes the parsed
schedule from `src/data/tripData.js` into Firestore on load (see
`ItineraryLanding.jsx`), merging in any changes each time. Bookings and
travelers live only in Firestore and are edited entirely in-app.

## 6. Deploy to GitHub Pages

1. This repo's `base` in `vite.config.js` is set to `/de-dk-26/` to match
   the GitHub repo name. If you rename the repo, update `base` to match.
2. Repo **Settings → Pages → Source → GitHub Actions**.
3. Repo **Settings → Secrets and variables → Actions → New repository
   secret** — add each `VITE_FIREBASE_*` value and `VITE_GOOGLE_MAPS_STATIC_KEY`
   from your `.env.local`. The Firebase values aren't sensitive (that config
   is meant to be public — real security is the Firestore rules); the maps
   key *is* meant to be restricted (step 2.4) but is also a normal
   client-side value once restricted — secrets just keep both out of the
   repo's committed files.
4. Push to `main`. The included workflow (`.github/workflows/deploy.yml`)
   builds and deploys automatically. Check the **Actions** tab for progress.

## A privacy note on traveler info

Passport numbers and dates of birth are sensitive. They are **not**
seeded anywhere in this codebase — the Travelers section on the Settings
page only writes to Firestore when someone fills out the form in the app
itself, so that data never ends up in git history, even if this repo is
public. Numbers are masked in the UI until tapped.

## What got adjusted while importing the original sheet

- 9/21 and 9/22 both read "Travel Day 5" — renumbered sequentially (days
  1–15) assuming it was a typo. Double-check `src/data/tripData.js` if
  that's wrong.
- The Oktoberfest package costs ($2,840 on 9/19, $2,637 on 9/21) were filed
  under "Lodging $" in the sheet but describe the festival package — moved
  to `activity.cost` instead. The trip total is unaffected either way.
- The per-adult math ($14,360 ÷ $1,795 ≈ 8) implies 8 travelers, but the
  Passports sheet only listed 7 — worth double-checking who's missing.
- Berlin lodging cost and the Berlin → Copenhagen travel mode weren't
  specified in the sheet; both are `null` in the data and easy to fill in
  from that day's page once bookings are firmed up (or log them as a
  day-scoped booking instead).
- Berlin and Copenhagen lodging `name`/`address` also aren't filled in yet
  (Munich and the Rhine Valley are, backfilled from the day-trip docs) —
  add them in `src/data/tripData.js` once you have the confirmation details.

## Extending it

- `src/data/tripData.js` — edit before the first import, or edit live data
  directly in the Firestore console / a future in-app editor.
- `src/data/cities.js` — city colors and anchor coordinates.
- Add a day-level "notes/journal" collection the same way `bookings` (now
  scoped per day via a `dayId` field, see `src/components/DayBookings.jsx`)
  and `travelers` were added, using `useFirestoreCollection`.
