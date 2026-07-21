// One vivid accent per leg of the route -- adapted from a reference visual
// style (bright, playful, Airbnb-esque). Each region carries four values:
//   `color`    -- the vivid fill (badges, active pins, buttons, tags)
//   `onColor`  -- text color to put ON TOP of a `color` fill (WCAG-checked
//                 per color, since some need dark text and some need light)
//   `textColor`-- a deepened variant of `color` safe to use AS text directly
//                 on a white/light background (the vivid fills themselves
//                 are all too light/bright for that -- verified via a
//                 contrast-ratio check, same approach as prior theme passes)
//   `tint`     -- a pale wash of `color`, used for icon chips and tag pills
export const CITIES = {
  munich: {
    label: 'Munich',
    shortLabel: 'MUC', // Munich's own airport code
    color: '#FFC93C', // vivid gold -- Oktoberfest & Bavarian beer halls
    onColor: '#1a1a1a',
    textColor: '#96680A',
    tint: '#FFF7E1',
    coords: [48.1351, 11.582],
    country: 'Germany',
  },
  rhine: {
    label: 'Rhine Valley',
    shortLabel: 'RHV', // no airport of its own -- a 3-letter code to match the others
    color: '#2EC4B6', // vivid teal -- the river and vineyard terraces
    onColor: '#1a1a1a',
    textColor: '#0E8074',
    tint: '#E3FAF8',
    coords: [50.2314, 7.5917], // Boppard
    country: 'Germany',
  },
  berlin: {
    label: 'Berlin',
    shortLabel: 'BER', // Berlin Brandenburg's airport code
    color: '#7B61FF', // vivid violet -- modern, urban
    onColor: '#ffffff',
    textColor: '#5B3FF0',
    tint: '#EFECFF',
    coords: [52.52, 13.405],
    country: 'Germany',
  },
  copenhagen: {
    label: 'Copenhagen',
    shortLabel: 'CPH', // Copenhagen Airport's own code
    color: '#FF5A5F', // vivid coral-red -- Nyhavn's colorful harbor houses
    onColor: '#1a1a1a',
    textColor: '#D62830',
    tint: '#FFEBEC',
    coords: [55.6761, 12.5683],
    country: 'Denmark',
  },
  transit: {
    label: 'In transit',
    shortLabel: null,
    color: '#8B95A1',
    onColor: '#1a1a1a',
    textColor: '#5b6169',
    tint: '#eef0f2',
    coords: null,
    country: null,
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
