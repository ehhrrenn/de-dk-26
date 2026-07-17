import { createContext, useContext, useEffect, useState } from 'react'

// Lets content pages (Location/Activity) report which region they resolved
// to, so the persistent TripTimeline header nav can highlight the right
// segment even on pages whose URL isn't /location/:slug.
const RegionContext = createContext({ region: null, setRegion: () => {} })

export function RegionProvider({ children }) {
  const [region, setRegion] = useState(null)
  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  return useContext(RegionContext)
}

export function useSetRegion(slug) {
  const { setRegion } = useRegion()
  useEffect(() => {
    setRegion(slug ?? null)
  }, [slug, setRegion])
}
