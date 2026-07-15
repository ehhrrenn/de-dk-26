// One accent per leg of the route. Used for the timeline's colored tabs
// and the map's pin colors, so the whole app reads as one continuous journey.
export const CITIES = {
  munich: {
    label: 'Munich',
    color: '#C98A3B', // pretzel / Oktoberfest mustard
    coords: [48.1351, 11.582],
  },
  rhine: {
    label: 'Rhine Valley',
    color: '#4A7C82', // river slate-teal
    coords: [50.2314, 7.5917], // Boppard
  },
  berlin: {
    label: 'Berlin',
    color: '#5C6B78', // concrete grey-blue
    coords: [52.52, 13.405],
  },
  copenhagen: {
    label: 'Copenhagen',
    color: '#D9694A', // Nyhavn coral
    coords: [55.6761, 12.5683],
  },
  transit: {
    label: 'In transit',
    color: '#8B95A1',
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
