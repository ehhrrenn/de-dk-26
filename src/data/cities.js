// One accent per leg of the route. Used for the timeline's colored tabs
// and the map's pin colors, so the whole app reads as one continuous journey.
// `onColor` is the text color to put on top of a filled `color` background
// (trip-timeline segments, active nav pills) -- picked per-region for WCAG
// contrast rather than hardcoded, since the route runs bright (Munich) to
// moody (Copenhagen) and one fixed text color can't read well on both ends.
export const CITIES = {
  munich: {
    label: 'Munich',
    color: '#C98A3B', // pretzel / Oktoberfest mustard
    onColor: '#1b1204',
    coords: [48.1351, 11.582],
  },
  rhine: {
    label: 'Rhine Valley',
    color: '#4A7C82', // river slate-teal
    onColor: '#f5f1e6',
    coords: [50.2314, 7.5917], // Boppard
  },
  berlin: {
    label: 'Berlin',
    color: '#4B5964', // cooler concrete grey-blue -- transitional mid-tone
    onColor: '#f5f1e6',
    coords: [52.52, 13.405],
  },
  copenhagen: {
    label: 'Copenhagen',
    color: '#4C5E82', // dusty indigo -- moodiest stop on the route
    onColor: '#f5f1e6',
    coords: [55.6761, 12.5683],
  },
  transit: {
    label: 'In transit',
    color: '#8B95A1',
    onColor: '#1b1204',
    coords: null,
  },
}

export function cityFor(placeName = '') {
  const p = placeName.toLowerCase()
  if (p.includes('munich')) return 'munich'
  if (p.includes('spay') || p.includes('boppard') || p.includes('bacharach')) return 'rhine'
  if (p.includes('berlin')) return 'berlin'
  if (p.includes('copenhagen')) return 'copenhagen'
  return 'transit'
}
