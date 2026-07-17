// One vivid accent per leg of the route. Used for the timeline's colored
// segments, active-state fills, headings, and primary buttons, so the whole
// app reads as one continuous journey -- region identity lives entirely in
// these accents now (page backgrounds are uniform/white). `onColor` is the
// text color to put on top of a filled `color` background, picked per-region
// via a WCAG contrast check rather than hardcoded (see the theme-pass
// verification script) since a single fixed text color can't read well
// against all four.
export const CITIES = {
  munich: {
    label: 'Munich',
    color: '#C97A0A', // vivid marigold/amber -- Bavaria & Oktoberfest
    onColor: '#1b1204',
    coords: [48.1351, 11.582],
  },
  rhine: {
    label: 'Rhine Valley',
    color: '#0B7A50', // vivid emerald -- river & vineyard green
    onColor: '#f7f5f2',
    coords: [50.2314, 7.5917], // Boppard
  },
  berlin: {
    label: 'Berlin',
    color: '#4A3FCF', // vivid indigo-violet -- modern/urban
    onColor: '#f7f5f2',
    coords: [52.52, 13.405],
  },
  copenhagen: {
    label: 'Copenhagen',
    color: '#C22E60', // vivid coral-rose -- Nyhavn's colorful harbor houses
    onColor: '#f7f5f2',
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
