import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = still checking, null = signed out

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])

  return { user, loading: user === undefined }
}
