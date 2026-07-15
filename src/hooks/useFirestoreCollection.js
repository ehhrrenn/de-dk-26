import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

// Realtime-synced Firestore collection. Every signed-in group member sees
// every other member's edits live, no refresh needed.
export function useFirestoreCollection(collectionName, { enabled = true } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) return
    setLoading(true)
    const unsub = onSnapshot(
      collection(db, collectionName),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
        setError(null)
      },
      (err) => {
        // 'permission-denied' here almost always means: signed in, but this
        // email hasn't been added to the /allowlist collection yet.
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [collectionName, enabled])

  async function add(id, data) {
    await setDoc(doc(db, collectionName, id), data, { merge: true })
  }

  async function update(id, data) {
    await updateDoc(doc(db, collectionName, id), data)
  }

  async function remove(id) {
    await deleteDoc(doc(db, collectionName, id))
  }

  return { items, loading, error, add, update, remove }
}
