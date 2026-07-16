// Parsed from the "Schedule" tab of the uploaded sheet, then enriched with
// day-trip Google Docs (see each activity's `summary`/`startingPoint`/
// `events`/`tips` below -- those docs are now fully inlined here instead of
// linked out to).
//
// Adjustments made while parsing, flagged here rather than silently:
//  1. 9/21 and 9/22 both read "Travel Day 5" in the source sheet -- renumbered
//     sequentially (1-15) assuming that was a typo.
//  2. The $2,840 (9/19) and $2,637 (9/21) figures sat in the "Lodging $"
//     column but their notes describe the Oktoberfest guided-festival
//     package, not lodging -- filed under each Oktoberfest activity's cost
//     instead. Doesn't change the trip total, just which bucket it's in.
//
// This is seed data only: the live source of truth is Firestore once
// you've imported it once from the app (see the landing page's "Sync
// latest itinerary details" button).

import { CITIES, cityFor } from './cities'

export const TRIP = {
  title: 'Germany + Denmark',
  start: '2026-09-17',
  end: '2026-10-01',
  groupSize: 8, // inferred from Per Adult ($1,795) x 8 = $14,360 total
  budget: {
    grandTotal: 14360,
    perAdult: 1795,
    perAdultPerDay: 138,
    flightsTracked: false, // sheet's Travel $ column was left at $0
  },
}

export const DAYS = [
  {
    id: 'day-01',
    date: '2026-09-17',
    dayNumber: 1,
    vacayDay: 0,
    cityDay: 'Flying',
    cityNight: 'Flying',
    isTravelDay: true,
    travel: { mode: 'flight', time: null, cost: null },
    lodging: null,
    coords: null,
    notes: '',
    activities: [
      { id: 'day-01-travel', name: 'Travel', emoji: '✈️', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
    ],
  },
  {
    id: 'day-02',
    date: '2026-09-18',
    dayNumber: 2,
    vacayDay: 1,
    cityDay: 'Munich',
    cityNight: 'Munich',
    isTravelDay: false,
    travel: null,
    lodging: {
      name: 'The Wunder House Munich',
      provider: 'Airbnb',
      address: 'Lindwurmstraße 189, 80337 München, Germany',
      link: 'https://www.airbnb.com/l/JqJV3QDH',
      cost: 5987,
      checkIn: '3:00 PM',
      checkOut: null,
    },
    coords: [48.1351, 11.582],
    notes: '',
    activities: [
      { id: 'day-02-shopping', name: 'Shopping', emoji: '🩳', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
    ],
  },
  {
    id: 'day-03',
    date: '2026-09-19',
    dayNumber: 3,
    vacayDay: 2,
    cityDay: 'Munich',
    cityNight: 'Munich',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [48.1351, 11.582],
    notes: '',
    activities: [
      {
        id: 'day-03-oktoberfest',
        name: 'Oktoberfest',
        emoji: '🍻',
        cost: 2840,
        summary: 'Price includes guided festival, food, drinks, table.',
        startingPoint: null,
        events: [],
        tips: [],
      },
    ],
  },
  {
    id: 'day-04',
    date: '2026-09-20',
    dayNumber: 4,
    vacayDay: 3,
    cityDay: 'Munich',
    cityNight: 'Munich',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [48.1752, 11.5516], // BMW Welt / Olympiapark, from sheet's DMS coords
    notes: '',
    activities: [
      {
        id: 'day-04-bmw-sayaq',
        name: 'BMW + SAYAQ',
        emoji: '🏛️',
        cost: null,
        summary: "A car-and-adventure day at Olympiapark: a morning immersed in BMW's showroom and museum, lunch lakeside at a beer garden, then an afternoon on Munich's newest climbing attraction overlooking the Olympic Stadium. Everything is reachable by a single, direct U-Bahn line from the hotel -- no transfers needed.",
        startingPoint: 'The Wunder House Munich, Lindwurmstraße 189, 80337 München, Germany. Nearest U-Bahn: Poccistraße (U3/U6), about a 5-8 min walk from the hotel.',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1226192,11.5458491&destination=48.1226192,11.5458491&waypoints=48.1771981,11.5562963%7C48.1768304,11.5590966%7C48.1740284,11.5555399%7C48.1731414,11.548747&travelmode=transit',
        events: [
          { time: '9:00 AM', title: 'BMW Welt', description: 'Free entry, showroom opens 9am Sundays. Latest BMW/Mini/Rolls-Royce models, sit in a few.' },
          { time: '10:00 AM', title: 'BMW Museum', description: 'Book 8 timed tickets ahead online, group rate ~€9/person (~€72 total). ~90 min self-guided through 125+ years of history.' },
          { time: '12:30 PM', title: 'Lunch: Augustiner Biergarten am Olympiasee', description: '5-min walk, lakeside beer garden, open Sun 11am-7pm, casual and built for groups.' },
          { time: '2:30 PM', title: 'SAYAQ Adventure Tower', description: "Munich's new (April 2026) 3-level high-ropes course at the stadium, 36-38 climbing stations, plus a viewing platform over the Olympic Stadium. Plan 2-3 hrs. Book ahead for a group of 8: +49 89 99176588 or sayaq-adventures-muenchen.com." },
          { time: '~5:00 PM', title: 'Walk to Olympiazentrum U-Bahn (U3)', description: 'Back into central Munich for dinner.' },
        ],
        tips: [
          'SAYAQ over the zipline alternative -- more physically varied (climbing across 3 levels vs. one zipline run) and better suited to a group of 8, since up to 60 people can be on the tower at once.',
          'The old Olympic Stadium roof-climb + zipline is permanently closed for this trip (shut since September 2025 for stadium renovation, not reopening until ~2027-28) -- SAYAQ is the replacement.',
          'Book the 8 BMW Museum timed-entry tickets online in advance for the group discount rate.',
        ],
      },
      {
        id: 'day-04-old-town-walk',
        name: 'Old Town Walking Tour',
        emoji: '🚶',
        cost: null,
        summary: "A relaxed, self-guided loop through Munich's old town mixing food stops with centuries of history -- medieval gates, Rococo churches, the Glockenspiel, and a lunch at Munich's oldest brewery restaurant. Built around Sunday hours: Viktualienmarkt's stalls are closed Mon-Sat only, so the food stops are routed to places open on Sundays instead.",
        startingPoint: 'The Wunder House Munich, Lindwurmstraße 189, 80337 München, Germany.',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1226192,11.5458491&destination=48.1226192,11.5458491&waypoints=48.1309601,11.5711858%7C48.1340387,11.5676369%7C48.1351434,11.5696647%7C48.1386649,11.5730127%7C48.1370339,11.5758134%7C48.1366805,11.5756044%7C48.1354703,11.5763682%7C48.1385971,11.5721771%7C48.14339,11.5779366&travelmode=walking',
        events: [
          { time: '8:45 AM', title: 'Leave the hotel', description: 'Walk toward Man Versus Machine Coffee Roasters (~15-18 min).' },
          { time: '9:00 AM', title: 'Coffee: Man Versus Machine Coffee Roasters', description: 'Müllerstraße 23. Open Sun 9am-7pm -- most of Munich\'s top-rated cafes are closed Sundays, this one isn\'t.' },
          { time: '9:30 AM', title: 'Walk to Sendlinger Tor', description: '~6-8 min walk.' },
          { time: '9:45 AM', title: 'Sendlinger Tor', description: 'One of only three surviving medieval gates of Munich\'s old town, part of the second fortification ring built under Duke Ludwig the Bavarian (1285-1337). First documented in 1318.' },
          { time: '10:00 AM', title: 'Asamkirche', description: 'Not a commission -- the Asam brothers built this as their own private church next to their house (1733-46). Tiny footprint packed with extravagant Bavarian Rococo decoration. Free entry.' },
          { time: '10:30 AM', title: 'Walk to Marienplatz', description: '~10 min via Kaufingerstraße.' },
          { time: '10:45 AM', title: 'Frauenkirche', description: "Munich's late-Gothic cathedral, completed 1488. Look for the \"Devil's Footprint\" mark just inside the entrance." },
          { time: '11:00 AM', title: 'Marienplatz -- Glockenspiel show', description: "The Neues Rathaus tower's mechanical show dates to 1908: 43 bells, 32 figures reenacting a 1568 wedding joust, followed by the coopers' dance. Free, ~12-15 min." },
          { time: '12:00 PM', title: "St. Peter's Church (Alter Peter)", description: "Munich's oldest parish church, predates the city's official founding in 1158. Optional 306-step tower climb (~€5-7pp) for the best panoramic view over the old town." },
          { time: '1:15 PM', title: 'Lunch: Augustiner Klosterwirt', description: 'Augustinerstraße 1. Munich\'s oldest brewery, founded 1328. Open Sun 9:30am-midnight. 4.5★.' },
          { time: '3:00 PM', title: 'Odeonsplatz & Feldherrnhalle', description: 'Built 1841-44 under King Ludwig I; also the site of the gunfight that ended the 1923 Beer Hall Putsch.' },
          { time: '3:45 PM', title: 'Free time', description: 'Stroll the Hofgarten or wander back through the old town at your own pace.' },
          { time: '4:30 PM', title: 'Back to hotel', description: 'Walk or U-Bahn back to Lindwurmstraße.' },
        ],
        tips: [
          "Viktualienmarkt food stalls and beer garden are closed on Sundays -- worth a walk-through for the atmosphere, but don't plan to eat there on 9/20.",
          "The Glockenspiel also plays at 12pm and 5pm (summer) if 11am doesn't work for the group's pace.",
          "St. Peter's tower climb is 306 steps with no elevator -- optional, skip if the group wants to keep the pace easy.",
          'Worth calling Augustiner Klosterwirt ahead for a table of 8.',
        ],
      },
    ],
  },
  {
    id: 'day-05',
    date: '2026-09-21',
    dayNumber: 5,
    vacayDay: 4,
    cityDay: 'Munich',
    cityNight: 'Munich',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [48.1351, 11.582],
    notes: '',
    activities: [
      {
        id: 'day-05-oktoberfest',
        name: 'Oktoberfest',
        emoji: '🍺',
        cost: 2637,
        summary: 'Price includes guided festival, food, drinks, table.',
        startingPoint: null,
        events: [],
        tips: [],
      },
    ],
  },
  {
    id: 'day-06',
    date: '2026-09-22',
    dayNumber: 6,
    vacayDay: 5,
    cityDay: 'Munich',
    cityNight: 'Spay / Boppard',
    isTravelDay: true,
    travel: { mode: 'car', time: '5h', cost: null },
    lodging: {
      name: null,
      provider: 'VRBO',
      address: 'Rheinufer 8, Spay, Rhineland-Palatinate, 56322 Germany',
      link: null,
      cost: 1231,
      checkIn: '4:00 PM',
      checkOut: '11:00 AM',
    },
    coords: [50.2314, 7.5917],
    notes: '',
    activities: [
      { id: 'day-06-travel', name: 'Travel', emoji: '🚋', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
    ],
  },
  {
    id: 'day-07',
    date: '2026-09-23',
    dayNumber: 7,
    vacayDay: 6,
    cityDay: 'Spay / Boppard',
    cityNight: 'Spay / Boppard',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [50.06, 7.7627], // from sheet's DMS coords
    notes: '',
    activities: [
      {
        id: 'day-07-river-cruise',
        name: 'River Cruise + Wine Tasting in Bacharach',
        emoji: '🍷',
        cost: null,
        summary: 'A self-planned day combining the KD (Köln-Düsseldorfer) Rhine line cruise with a wine tasting lunch in Bacharach, one of the prettiest wine towns on the Middle Rhine. No car needed. Round trip runs about 8-8.5 hours door-to-door.',
        startingPoint: "Rheinufer 8, Spay, Rhineland-Palatinate, 56322 Germany -- the holiday house. Boppard's KD landing stage is about 3 km away: a 35-40 min walk along the riverside path, or a 5-10 min taxi ride.",
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=50.2510124,7.6457441&destination=50.2510124,7.6457441&waypoints=50.232917,7.5898717%7C50.0590983,7.7689488%7C50.0584898,7.7682846%7C50.0603334,7.7680244%7C50.0590983,7.7689488%7C50.232917,7.5898717&travelmode=walking',
        events: [
          { time: '10:20-10:25 AM', title: 'Leave the house', description: 'Rheinufer 8, Spay -- walk the riverside path to Boppard (~35-40 min) or taxi (~5-10 min).' },
          { time: '10:45 AM', title: 'Arrive KD landing stage, Boppard', description: 'Rheinallee -- buy tickets.' },
          { time: '11:00 AM', title: 'Depart upriver toward Bacharach', description: '~2.5 hr scenic cruise past St. Goar, the Loreley, Oberwesel.' },
          { time: '~1:15 PM', title: 'Arrive Bacharach dock', description: 'Walk 5-10 min into old town.' },
          { time: '1:30-3:30 PM', title: 'Lunch + wine tasting: Weingut Karl Heidrich', description: '4.7★, family-owned. Order the 6-wine tasting carousel.' },
          { time: '3:30-5:00 PM', title: 'Stroll Bacharach', description: 'Half-timbered streets, Wernerkapelle, optional hike toward Burg Stahleck.' },
          { time: '5:15 PM', title: 'Board return boat', description: 'Downriver (faster, ~1.5-2 hrs with the current).' },
          { time: '~6:45-7:00 PM', title: 'Back at Boppard dock', description: 'Short drive to Spay for dinner.' },
        ],
        tips: [
          'Wednesday works well because Weingut Karl Heidrich is closed Sun/Mon.',
          'For a 10-hour version: push the return to the 17:15 Bacharach departure and add more time in Bacharach or hiking to Burg Stahleck.',
          "KD's exact 2026 minute-by-minute schedule (especially southbound departures from Boppard) can shift season to season -- confirm on k-d.com about a month out, or grab tickets at the Boppard kiosk the morning of.",
          'KD boats accept cash, Maestro, and credit cards at the ticket kiosk; card acceptance onboard can be spotty, so carry some cash for food/drinks.',
          'The Boppard landing stage currently has posted traffic restrictions due to riverbank construction -- worth a quick check on k-d.com closer to the date in case the dock location shifts temporarily.',
          'Bring layers -- the open sun deck is breezy even on warm September days.',
        ],
      },
    ],
  },
  {
    id: 'day-08',
    date: '2026-09-24',
    dayNumber: 8,
    vacayDay: 7,
    cityDay: 'Spay / Boppard',
    cityNight: 'Spay / Boppard',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [50.3103, 7.6389], // Marksburg Castle / Braubach
    notes: '',
    activities: [
      {
        id: 'day-08-marksburg-weingart',
        name: 'Marksburg Castle + Weingart Wine Tasting',
        emoji: '🏰',
        cost: null,
        summary: "A car-free castle-and-wine day: a direct KD boat to Braubach, a guided tour through the Rhine's only never-conquered castle, a train back through Koblenz, and a wine tasting a short walk from the house to close out the day.",
        startingPoint: "Rheinufer 8, Spay, Rhineland-Palatinate, 56322 Germany. Boppard's KD landing stage / train station is about 3 km away (35-40 min walk or 5-10 min taxi). Weingut Weingart is less than 1 km from the house (~15 min walk).",
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=50.2510124,7.6457441&destination=50.2510124,7.6457441&waypoints=50.232917,7.5898717%7C50.2709793,7.6450185%7C50.271987,7.6493885%7C50.27414,7.643187%7C50.231406,7.586084%7C50.2499526,7.6363986&travelmode=walking',
        events: [
          { time: '9:30-9:35 AM', title: 'Leave the house', description: 'Rheinufer 8, Spay -- walk the riverside path to Boppard (~35-40 min) or taxi (~5-10 min).' },
          { time: '10:00 AM', title: 'Boppard KD Landing Stage', description: 'Arrive with buffer. Buy tickets at the kiosk.' },
          { time: '10:15 AM', title: 'Depart Boppard -> Braubach', description: 'Direct KD boat, no transfer, ~30 min scenic ride. Confirm this sailing on k-d.com nearer the date.' },
          { time: '10:45 AM', title: 'Arrive Braubach', description: 'Disembark and walk into town.' },
          { time: '11:00 AM', title: 'Lunch / explore old town', description: 'NH Asian Cuisine & Sushi is open Thu 12-9pm. Otherwise browse the timber-framed old town before the climb.' },
          { time: '12:30 PM', title: 'Walk up to Marksburg Castle', description: '~25-30 min uphill walk, switchbacks. Buy castle tickets on arrival (guided-tour-only access).' },
          { time: '1:00 PM', title: 'Marksburg Castle -- English Guided Tour', description: "50 min tour, daily English tour at 1pm (also 4pm) through October. Kitchen, armory, wine cellar, chapel, knights' hall. €11-14/adult." },
          { time: '2:00 PM', title: 'Walk back to Braubach Bahnhof', description: '~20 min walk down to the train station.' },
          { time: '2:45 PM', title: 'Train: Braubach -> Koblenz Hbf -> Boppard', description: '~40 min total incl. transfer at Koblenz Hbf, roughly hourly. Confirm exact times on bahn.com nearer the date.' },
          { time: '3:30 PM', title: 'Arrive Boppard Hauptbahnhof', description: 'Walk to Weingart (~25-30 min) or taxi -- a good option after the castle hike.' },
          { time: '4:00-6:30 PM', title: 'Weingut Weingart -- Wine Tasting', description: 'Open Thu 2:00-6:30pm. Family-run winery, award-winning Riesling and Spätburgunder. Call ahead for a group of 8: +49 2628 8735.' },
          { time: '~6:45 PM', title: 'Walk home', description: 'Weingart to the house: ~15 min walk.' },
        ],
        tips: [
          'Marksburg is guided-tour-only -- no self-guided access. English tours run daily at 1pm and 4pm through October; arrive with a buffer to buy tickets.',
          'The uphill walk to the castle is real: ~25-30 min on switchbacks from either the boat dock or train station. No shuttle, though locals sometimes run informal car service up the hill.',
          "Weingut Weingart is closed Sundays -- don't shift this plan to a Sunday. Open 2:00-6:30pm Mon-Fri, 11:00am-6:30pm Sat.",
          "Call Weingart ahead for a group of 8 (+49 2628 8735) -- it's a small, casual family operation, not set up for tour buses.",
          'Confirm the 10:15 AM direct KD boat and the Braubach-Koblenz-Boppard train connection on k-d.com and bahn.com a few weeks before -- both schedules can shift seasonally.',
          'The Boppard landing stage currently has posted traffic restrictions due to riverbank construction -- worth a quick check closer to the date.',
          "Fallback if the direct boat isn't running: train both ways via Koblenz (~40 min each way).",
        ],
      },
    ],
  },
  {
    id: 'day-09',
    date: '2026-09-25',
    dayNumber: 9,
    vacayDay: 8,
    cityDay: 'Spay / Boppard',
    cityNight: 'Berlin',
    isTravelDay: true,
    travel: { mode: null, time: '6h', cost: null },
    lodging: {
      name: 'Home in Berlin',
      provider: 'Airbnb',
      address: 'Schleiermacherstraße 12, Berlin, Berlin 10961, Germany',
      link: 'https://www.airbnb.com/trips/v1/reservation-details/ro/RESERVATION2_CHECKIN/HMZWP8RDJS',
      cost: null,
      checkIn: '3:00 PM',
      checkOut: '10:00 AM',
    },
    coords: [52.52, 13.405],
    notes: '',
    activities: [
      { id: 'day-09-travel', name: 'Travel', emoji: '🚆', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
    ],
  },
  {
    id: 'day-10',
    date: '2026-09-26',
    dayNumber: 10,
    vacayDay: 9,
    cityDay: 'Berlin',
    cityNight: 'Berlin',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [52.52, 13.405],
    notes: '',
    activities: [
      { id: 'day-10-disco', name: 'Disco', emoji: '🪩', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
    ],
  },
  {
    id: 'day-11',
    date: '2026-09-27',
    dayNumber: 11,
    vacayDay: 10,
    cityDay: 'Berlin',
    cityNight: 'Berlin',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [52.52, 13.405],
    notes: 'Free day -- nothing scheduled yet.',
    activities: [],
  },
  {
    id: 'day-12',
    date: '2026-09-28',
    dayNumber: 12,
    vacayDay: 11,
    cityDay: 'Berlin',
    cityNight: 'Copenhagen',
    isTravelDay: true,
    // Sheet didn't specify a travel mode/time for this leg -- flight is the
    // typical way to cover Berlin-Copenhagen; confirm and fill in.
    travel: { mode: null, time: null, cost: null },
    lodging: {
      name: 'Home in Copenhagen',
      provider: 'Airbnb',
      address: 'Cort Adelers Gade 12A, 1053 København, Denmark',
      link: 'https://www.airbnb.com/trips/v1/reservation-details/ro/RESERVATION2_CHECKIN/HMRYWHMNYT',
      cost: 1665,
      checkIn: '11:00 AM',
      checkOut: null,
    },
    coords: [55.6761, 12.5683],
    notes: '',
    activities: [],
  },
  {
    id: 'day-13',
    date: '2026-09-29',
    dayNumber: 13,
    vacayDay: 12,
    cityDay: 'Copenhagen',
    cityNight: 'Copenhagen',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [55.6761, 12.5683],
    notes: 'Free day -- nothing scheduled yet.',
    activities: [],
  },
  {
    id: 'day-14',
    date: '2026-09-30',
    dayNumber: 14,
    vacayDay: 13,
    cityDay: 'Copenhagen',
    cityNight: 'Copenhagen',
    isTravelDay: false,
    travel: null,
    lodging: null,
    coords: [55.6761, 12.5683],
    notes: 'Free day -- nothing scheduled yet.',
    activities: [],
  },
  {
    id: 'day-15',
    date: '2026-10-01',
    dayNumber: 15,
    vacayDay: 14,
    cityDay: 'Copenhagen',
    cityNight: 'Flying',
    isTravelDay: true,
    travel: { mode: 'flight', time: null, cost: null },
    lodging: null,
    coords: [55.6761, 12.5683],
    notes: '',
    activities: [
      { id: 'day-15-travel', name: 'Travel', emoji: '✈️', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
    ],
  },
]

// Resolves which trip location a day belongs to. A travel day belongs to its
// destination (cityNight) if that resolves to a real place; otherwise falls
// back to cityDay (covers the last day of a trip, whose cityNight is
// 'Flying'). If *both* ends are unresolved (day-01, where the group is only
// ever "Flying"), walk forward to the next day that does resolve and borrow
// its location -- this is what puts the arrival flight on the destination's
// page instead of dropping it into the untouchable 'transit' bucket.
export function resolveDaySlug(day, sortedDays) {
  if (day.isTravelDay) {
    const nightSlug = cityFor(day.cityNight)
    if (nightSlug !== 'transit') return nightSlug
    const daySlug = cityFor(day.cityDay)
    if (daySlug !== 'transit') return daySlug
    const idx = sortedDays.findIndex((d) => d.id === day.id)
    for (const d of sortedDays.slice(idx + 1)) {
      const slug = cityFor(d.isTravelDay ? d.cityNight : d.cityDay)
      if (slug !== 'transit') return slug
    }
    return 'transit'
  }
  return cityFor(day.cityDay)
}

// Groups days into their major trip locations (Munich, Rhine Valley, Berlin,
// Copenhagen) via resolveDaySlug(). Purely derived from Firestore day data at
// render time -- not persisted, no new collection. Each location also
// surfaces its `arrival` (the travel day that brought the group there, for
// "getting here" cards) and `lodging` (the first day in the stay that carries
// a lodging object -- the de-facto de-dupe rule the seed data already uses).
export function locationsFromDays(days) {
  const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber)
  const bySlug = new Map()

  for (const day of sorted) {
    const slug = resolveDaySlug(day, sorted)
    if (slug === 'transit') continue
    if (!bySlug.has(slug)) bySlug.set(slug, [])
    bySlug.get(slug).push(day)
  }

  return Object.keys(CITIES)
    .filter((slug) => slug !== 'transit' && bySlug.has(slug))
    .map((slug) => {
      const locationDays = bySlug.get(slug)
      return {
        slug,
        label: CITIES[slug].label,
        color: CITIES[slug].color,
        onColor: CITIES[slug].onColor,
        coords: CITIES[slug].coords,
        days: locationDays,
        dateRange: { start: locationDays[0].date, end: locationDays[locationDays.length - 1].date },
        arrival: locationDays[0].isTravelDay ? locationDays[0] : null,
        lodging: locationDays.find((d) => d.lodging)?.lodging ?? null,
      }
    })
}
