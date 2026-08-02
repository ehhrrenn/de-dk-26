// Adds/updates travelers in the Firestore `allowlist` collection.
//
// One-time setup:
//   1. cp scripts/allowlist-roster.example.json scripts/allowlist-roster.json
//      and fill in real names/emails. This file is gitignored -- it holds
//      personal data and must never be committed.
//   2. Create a service-account key with Firestore access (Firebase
//      Console -> Project settings -> Service accounts -> Generate new
//      private key). Never commit the key file either.
//   3. Run:
//        GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json pnpm seed-allowlist

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import admin from 'firebase-admin'

const rosterPath = fileURLToPath(new URL('./allowlist-roster.json', import.meta.url))

let roster
try {
  roster = JSON.parse(readFileSync(rosterPath, 'utf8'))
} catch (err) {
  console.error(
    `Couldn't read ${rosterPath}.\n` +
      'Copy scripts/allowlist-roster.example.json to scripts/allowlist-roster.json ' +
      'and fill in real travelers first (that file is gitignored, so it stays local).'
  )
  throw err
}

admin.initializeApp({ credential: admin.credential.applicationDefault() })
const db = admin.firestore()

for (const { email, name } of roster) {
  await db.collection('allowlist').doc(email).set({ name }, { merge: true })
  console.log(`✓ ${email} (${name})`)
}

console.log(`\nDone -- ${roster.length} travelers written to /allowlist.`)
