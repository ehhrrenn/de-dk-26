import { createContext, useContext, useEffect, useState } from 'react'

// Lets the home page publish its already-fetched `days` up to App.jsx, so
// the countdown StatusBar can render in the header (above the sticky pill
// row) without App.jsx running a second Firestore listener just for status.
const HomeStatusContext = createContext({ days: [], setDays: () => {} })

export function HomeStatusProvider({ children }) {
  const [days, setDays] = useState([])
  return (
    <HomeStatusContext.Provider value={{ days, setDays }}>
      {children}
    </HomeStatusContext.Provider>
  )
}

export function useHomeStatusDays() {
  return useContext(HomeStatusContext).days
}

export function useSetHomeStatusDays(days) {
  const { setDays } = useContext(HomeStatusContext)
  useEffect(() => {
    setDays(days)
  }, [days, setDays])
}
