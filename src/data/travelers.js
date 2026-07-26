// Traveler roster from the group's shared planning spreadsheet
// ("Germany/Denmark 2026" > Passports tab) -- names only. Seed data,
// synced into Firestore the same way tripData.js's DAYS are (see the sync
// effect in ItineraryLanding.jsx). Passport numbers/DOB/etc. are
// deliberately NOT seeded here -- same rule as the Settings.jsx form:
// that data goes straight to Firestore via each traveler entering their
// own, never committed to the repo.
export const TRAVELERS = [
  { id: 'traveler-aaron-menkens', name: 'Aaron John Menkens' },
  { id: 'traveler-blake-thomson', name: 'Blake Gilbert Thomson' },
  { id: 'traveler-mark-gage', name: 'Mark Harden Gage' },
  { id: 'traveler-selena-russell', name: 'Selena Marie Russell' },
  { id: 'traveler-joshua-romain', name: 'Joshua Tyler Romain' },
  { id: 'traveler-kaitlyn-romain', name: 'Kaitlyn Joy Romain' },
  { id: 'traveler-myra-montemayor', name: 'Myra Gabriela Montemayor' },
  { id: 'traveler-kyle-marchuk', name: 'Kyle Daniel Marchuk' },
]
