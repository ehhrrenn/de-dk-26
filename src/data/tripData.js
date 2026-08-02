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
//
// Currency: every amount in this file -- `cost` fields and any price
// mentioned in event/tip text -- is USD. Source material in EUR/DKK/etc.
// gets converted (~1.08 USD/EUR, ~0.145 USD/DKK) and rounded before it
// goes in; never leave a non-USD figure in place.

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
      {
        id: 'day-01-flight',
        name: 'SFO → Munich (via Copenhagen)',
        icon: 'flight',
        category: 'Travel',
        cost: 1949.42,
        summary: 'Scandinavian Airlines, booking Z8WWPP. $1,949.42 is the round-trip total (flights + seats + taxes) for Aaron & Blake\'s tickets -- covers both this outbound leg and the Oct 1 return. Kaitlyn, Josh, and Mark are on these same flights via separate bookings.',
        startingPoint: 'San Francisco International Airport (SFO), Terminal I',
        travelers: ['Aaron Menkens', 'Blake Thomson', 'Kaitlyn Romain', 'Josh Romain', 'Mark Gage'],
        events: [
          { time: '4:45 PM (Sep 17)', title: 'SK 936 -- San Francisco (SFO) → Copenhagen (CPH)', description: 'Scandinavian Airlines, Airbus A350-900. Departure Terminal I. 10h 15m nonstop. Seats 41G/41H (Aaron/Blake). Meal included, 2 checked bags.' },
          { time: '12:00 PM (Sep 18)', title: 'Arrive Copenhagen (CPH)', description: 'Arrival Terminal 3. 50 min transfer at Kastrup.' },
          { time: '12:50 PM (Sep 18)', title: 'SK 1665 -- Copenhagen (CPH) → Munich (MUC)', description: 'Cityjet, Canadair Regional Jet 900. Departure Terminal 3. 1h 35m. Booking class U.' },
          { time: '2:25 PM (Sep 18)', title: 'Arrive Munich (MUC)', description: 'Arrival Terminal 1.' },
        ],
        tips: [],
      },
      {
        id: 'day-01-to-stay',
        name: 'To Munich Stay',
        icon: 'train',
        category: 'Travel',
        cost: null,
        summary: 'From Munich Airport (MUC) to The Wunder House Munich.',
        startingPoint: 'Munich Airport (MUC), Terminal 1',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.353783,11.786086&destination=48.1226192,11.5458491&travelmode=transit',
        linkLabel: 'Get directions to the stay',
        events: [
          { time: '~3:00 PM (Sep 18)', title: 'Head to the Munich stay', description: 'From MUC (Terminal 1) to Lindwurmstraße 189. Check-in from 3:00 PM.' },
        ],
        tips: [],
      },
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
      {
        id: 'day-02-shopping',
        name: 'Bavarian Outfitters: Lederhosen & Dirndl',
        icon: 'shopping',
        category: 'Shopping',
        cost: null,
        summary: "Rent (or buy) lederhosen and dirndl ahead of Oktoberfest -- reserve online by size and pickup date, then pick the exact model and get fitted in person at the store. Over 1,500 outfits in stock, with on-site fitting rooms and staff to help dial in sizing and color.",
        startingPoint: 'The Wunder House Munich, Lindwurmstraße 189, 80337 München, Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1226192,11.5458491&destination=48.12626898502202,11.557187498593033&travelmode=walking',
        linkLabel: 'Get directions to Bavarian Outfitters',
        websiteUrl: 'https://bavarian-outfitters.de/',
        websiteLabel: 'Visit Bavarian Outfitters',
        events: [],
        tips: [
          'Book online ahead at bavarian-outfitters.de -- enter sizes and a pickup date, then choose the exact model in person at pickup.',
          'This location: Lindwurmstraße 108A, 80337 München -- same street as the hotel, about a 5 min walk.',
          'Fixed store hours only run during Oktoberfest: Mon-Thu 8:30 AM-6 PM, Fri-Sat 7:30 AM-6 PM, Sun 9 AM-6 PM. Outside those windows, arrange a pickup time after booking online.',
          'Questions: kontakt@bavarian-outfitters.de.',
        ],
      },
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
        name: 'Oktoberfest: Armbrustschützen-Festzelt',
        icon: 'beer',
        category: 'Festival',
        cost: 2840,
        summary: "10 seats at the table, double-shift booking -- valid continuously from 10 AM until close (~11 PM), no fixed arrival time. Covers 7 drink vouchers per person (50 total = 5 x 1L Maß each), 10x lunch or dinner, 10x dessert, and one shared traditional Bavarian bread dish (Brotzeit) for the table. That's everything the package paid for.",
        startingPoint: 'Armbrustschützen-Festzelt, Wirtsbudenstraße 107, 80336 München, Germany',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Armbrustsch%C3%BCtzen-Festzelt%2C%20Wirtsbudenstra%C3%9Fe%20107%2C%2080336%20M%C3%BCnchen%2C%20Germany',
        linkLabel: 'Find Armbrustschützen-Festzelt',
        websiteUrl: 'https://www.oktoberfest.de/en/tents/big-tents/armbrustschuetzenzelt',
        websiteLabel: 'Tent info: Armbrustschützen-Festzelt',
        events: [],
        tips: [
          "Western part of the Theresienwiese fairgrounds (Wirtsbudenstraße 107) -- the guild's own tent building since 1965. ~5,830 seats inside, ~1,600 more in the beer garden.",
          "Run by the Armbrustschützenverein (crossbow shooters' guild); pours Paulaner. One of Oktoberfest's more traditional, relaxed tents -- Bavarian culture over pure party atmosphere.",
        ],
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
    title: 'BMW+SAYAQ or Munich City Walk',
    activities: [
      {
        id: 'day-04-bmw-sayaq',
        name: 'BMW + SAYAQ',
        icon: 'landmark',
        category: 'Tour',
        cost: null,
        summary: "A car-and-adventure day at Olympiapark: a morning immersed in BMW's showroom and museum, lunch lakeside at a beer garden, then an afternoon on Munich's newest climbing attraction overlooking the Olympic Stadium. Everything is reachable by a single, direct U-Bahn line from the hotel -- no transfers needed.",
        startingPoint: 'The Wunder House Munich, Lindwurmstraße 189, 80337 München, Germany. Nearest U-Bahn: Poccistraße (U3/U6), about a 5-8 min walk from the hotel.',
        startDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=BMW%20Welt%2C%20Am%20Olympiapark%201%2C%2080809%20M%C3%BCnchen%2C%20Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1771981,11.5562963&destination=48.1731414,11.548747&waypoints=48.1768304,11.5590966%7C48.1740284,11.5555399&travelmode=transit',
        events: [
          { time: '9:00 AM', title: 'BMW Welt', description: 'Free entry, showroom opens 9am Sundays. Latest BMW/Mini/Rolls-Royce models, sit in a few.' },
          { time: '10:00 AM', title: 'BMW Museum', description: 'Book 8 timed tickets ahead online, group rate ~$10/person (~$78 total). ~90 min self-guided through 125+ years of history.' },
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
        id: 'day-04-munich-walk-1',
        name: 'Munich Walk: Marienplatz → Frauenkirche',
        tabLabel: 'Phase 1',
        icon: 'walk',
        category: 'Tour',
        cost: null,
        summary: "Phase 1 of a self-guided walk through Munich's old town (Rick Steves' Munich City Walk). This leg covers Marienplatz, the Viktualienmarkt, and the Frauenkirche. Continue with the next two tabs for the rest of the route to the Hofgarten.",
        startingPoint: 'Marienplatz, Munich, Germany',
        startDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=Marienplatz%2C%2080331%20M%C3%BCnchen%2C%20Germany',
        startDirectionsLabel: 'Get directions to Marienplatz',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1374,11.5755&destination=48.1386,11.5730&waypoints=48.1367,11.5762%7C48.1351,11.5763%7C48.1339,11.5758%7C48.1345,11.5713%7C48.1379,11.5716%7C48.1383,11.5697&travelmode=walking',
        linkLabel: 'Get directions: Phase 1',
        events: [
          { time: '8:40 AM', title: 'Leave the Munich stay', description: 'Head to Marienplatz via U-Bahn (Marienplatz, U3/U6) or an easy ~20 min walk from Lindwurmstraße.' },
          { time: '9:00 AM', title: 'Marienplatz', description: "Munich's central square since 1158, marked by the Mariensäule (Mary's Column), erected in 1638 to celebrate the city surviving Swedish occupation during the Thirty Years' War.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Marienplatz' },
          { time: '9:10 AM', title: "St. Peter's Church", description: "Munich's oldest parish church, first documented around 1181. Its tower (\"Alter Peter\") is a 306-step climb rewarded with the best rooftop panorama over the old town.", wikipediaUrl: "https://en.wikipedia.org/wiki/St._Peter's_Church,_Munich" },
          { time: '9:25 AM', title: 'Viktualienmarkt', description: "A daily food market since 1807, when Munich's old grain market outgrew its space on Marienplatz. Permanent stalls today sell produce, flowers, and Bavarian specialties around a beer garden.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Viktualienmarkt' },
          { time: '9:40 AM', title: 'Ohel Jakob Synagogue', description: "The main synagogue of Munich's Jewish community, dedicated in 2006 as part of the Jewish Center Munich. Its cube-shaped travertine base topped by a glass structure evokes the tent-like Tabernacle of the Israelites' desert wanderings.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Ohel_Jakob_synagogue_(Munich)' },
          { time: '9:55 AM', title: 'Asam Church', description: "Not a commission -- the Asam brothers built this as their own private church next to their house (1733-46). Tiny footprint packed with extravagant Bavarian Rococo decoration. Free entry.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Asam_Church,_Munich' },
          { time: '10:10 AM', title: 'Kaufingerstrasse', description: "Munich's busiest shopping street, part of the pedestrian zone linking Marienplatz to Karlsplatz -- the same route medieval merchants used entering the city from the west.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Kaufingerstra%C3%9Fe' },
          { time: '10:20 AM', title: "St. Michael's Church", description: 'The largest Renaissance church north of the Alps, built 1583-97 for the Jesuit order. Its crypt holds the remains of Bavarian King Ludwig II.', wikipediaUrl: "https://en.wikipedia.org/wiki/St._Michael's_Church,_Munich" },
          { time: '10:30 AM', title: 'Frauenkirche', description: 'Munich\'s late-Gothic cathedral, completed 1488. Look for the "Devil\'s Footprint" mark just inside the entrance.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Frauenkirche,_Munich' },
        ],
        tips: [
          'Start at Marienplatz, reachable via the Marienplatz U/S-Bahn station (U3/U6, S-Bahn lines) right in the square.',
          'Full walk (all 3 phases) covers 19 stops through the compact old town -- budget 2.5-3 hours at an easy pace.',
        ],
      },
      {
        id: 'day-04-munich-walk-2',
        name: 'Munich Walk: Marienhof → Hofbräuhaus',
        tabLabel: 'Phase 2',
        icon: 'walk',
        category: 'Tour',
        cost: null,
        summary: 'Phase 2, continuing past Marienhof and the historic Dallmayr delicatessen to the Hofbräuhaus.',
        startingPoint: 'Marienhof, Munich, Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1390,11.5748&destination=48.1374,11.5799&waypoints=48.1373,11.5786%7C48.1378,11.5789%7C48.1373,11.5797&travelmode=walking',
        linkLabel: 'Get directions: Phase 2',
        events: [
          { time: '10:45 AM', title: 'Marienhof', description: 'A quiet green square just north of the New Town Hall, largely rebuilt after WWII bombing destroyed the buildings that once stood here -- long eyed for development but kept open as a rare patch of grass in the old town.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Marienhof' },
          { time: '10:55 AM', title: 'Dallmayr Delicatessen', description: "Munich's legendary gourmet grocer since 1700, famous for its elaborate window displays and coffee roasting -- long a favorite supplier to the Bavarian royal court.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Dallmayr' },
          { time: '11:05 AM', title: 'Alter Hof', description: "The original moated castle of the Wittelsbach dukes, built around 1255 as Munich's first royal residence before the family moved to the larger Residenz nearby.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Alter_Hof' },
          { time: '11:15 AM', title: 'Platzl Square', description: 'A small historic square whose name simply means "little place," long associated with the beer hall culture centered on the Hofbräuhaus at its edge.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Platzl_(Munich)' },
          { time: '11:20 AM', title: 'Hofbräuhaus', description: "Munich's most famous beer hall, founded as the royal Bavarian court brewery in 1589 and opened to the public in 1828. Its vaulted hall has hosted everyone from Mozart to Lenin.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Hofbr%C3%A4uhaus_am_Platzl' },
        ],
        tips: [
          "Worth a stop inside the Hofbräuhaus even just to see the vaulted hall and painted ceiling, whether or not it's a meal stop today.",
        ],
      },
      {
        id: 'day-04-munich-walk-3',
        name: 'Munich Walk: Maximilianstrasse → Hofgarten',
        tabLabel: 'Phase 3',
        icon: 'walk',
        category: 'Tour',
        cost: null,
        summary: 'Phase 3, past the Residenz palace and Odeonsplatz, finishing at the Hofgarten.',
        startingPoint: 'Maximilianstrasse, Munich, Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=48.1391,11.5810&destination=48.1424,11.5787&waypoints=48.1402,11.5786%7C48.1414,11.5771%7C48.1420,11.5768%7C48.1427,11.5745&travelmode=walking',
        linkLabel: 'Get directions: Phase 3',
        events: [
          { time: '11:35 AM', title: 'Maximilianstrasse', description: "One of Munich's four royal avenues, laid out under King Maximilian II in the 1850s in an eclectic style blending Gothic, Renaissance, and English influences -- today lined with high-end boutiques and the National Theater.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Maximilianstra%C3%9Fe_(Munich)' },
          { time: '11:45 AM', title: 'Max-Joseph-Platz', description: 'The stately square fronting the Residenz palace and the Bavarian National Theater, named for King Maximilian I Joseph, whose statue anchors the square.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Max-Joseph-Platz' },
          { time: '11:55 AM', title: 'Viscardigasse', description: 'A narrow side alley nicknamed "Dodger\'s Alley," used by Munich residents during the Nazi era to detour around the Feldherrnhalle memorial on Odeonsplatz and avoid the mandatory Hitler salute required there.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Dr%C3%BCckebergergasse' },
          { time: '12:00 PM', title: 'Odeonsplatz', description: "Anchored by the Feldherrnhalle, an 1844 monument to Bavarian military leaders modeled on Florence's Loggia dei Lanzi -- also the site of the failed 1923 Beer Hall Putsch's violent climax.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Odeonsplatz' },
          { time: '12:10 PM', title: 'Brienner Strasse', description: "Another of Munich's grand 19th-century boulevards, running from Odeonsplatz toward Königsplatz.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Brienner_Stra%C3%9Fe_(Munich)' },
          { time: '12:20 PM', title: 'Hofgarten', description: 'A formal Italian Renaissance-style garden laid out in 1613-17 for the Wittelsbach rulers behind the Residenz, its central pavilion topped by a gilded figure of Bavaria. Walk ends here.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Hofgarten_(Munich)' },
        ],
        tips: [
          "Walk complete -- the English Garden is a short walk further north if there's time and energy left, or head back for lunch in the old town.",
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
        name: 'Oktoberfest: Hofbräu-Festzelt',
        icon: 'beer',
        category: 'Festival',
        cost: 2637,
        summary: "10 seats at the table, double-shift booking -- valid continuously from 10 AM until close (~11 PM), no fixed arrival time. Covers 7 drink vouchers per person (50 total = 5 x 1L Maß each), 10x lunch or dinner, 10x dessert, and one shared traditional Bavarian bread dish (Brotzeit) for the table. That's everything the package paid for.",
        startingPoint: 'Hofbräu-Festzelt, Wirtsbudenstraße 83, 80336 München, Germany',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Hofbr%C3%A4u-Festzelt%2C%20Wirtsbudenstra%C3%9Fe%2083%2C%2080336%20M%C3%BCnchen%2C%20Germany',
        linkLabel: 'Find Hofbräu-Festzelt',
        websiteUrl: 'https://www.muenchen.de/en/events/oktoberfest/beer-tents/hofbraeu-festzelt',
        websiteLabel: 'Tent info: Hofbräu-Festzelt',
        events: [],
        tips: [
          "One of the biggest tents on the Wiesn (~10,000 capacity: ~4,500 indoor, ~1,518 balcony, ~1,000 standing, ~3,022 in the beer garden) -- run by the Staatliches Hofbräuhaus.",
          "This is the Oktoberfest tent, not the separate year-round Hofbräuhaus am Platzl beer hall downtown.",
          'Especially popular with international visitors, and the only tent with a standing-only area right in front of the band -- expect a livelier atmosphere than the Armbrustschützenzelt.',
        ],
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
    travel: { mode: 'train', time: '5h 31m', cost: null },
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
      {
        id: 'day-06-travel',
        name: 'Train: Munich → Spay',
        icon: 'train',
        category: 'Travel',
        cost: null,
        summary: 'Three-leg Deutsche Bahn journey: ICE to Frankfurt, S-Bahn to Mainz, regional train to Spay.',
        startingPoint: 'München Hbf, Platform 22',
        directionsUrl: 'https://int.bahn.de/en/buchung/start?vbid=30195a4d-13d5-4bea-8b44-0a11fb2efa75',
        linkLabel: 'View train tickets',
        events: [
          { time: '9:46 AM', title: 'ICE 722 -- München Hbf → Frankfurt(Main)Hbf', description: 'Direction Düsseldorf Hbf. Board at München Hbf, Platform 22. Arrive Frankfurt(Main)Hbf 1:02 PM.' },
          { time: '1:17 PM', title: 'S8 -- Frankfurt Hbf (tief) → Mainz Hbf', description: 'Direction Wiesbaden Hbf. Board at Frankfurt Hbf (tief), Platform 103. Arrive Mainz Hbf 1:55 PM, Platform 1a.' },
          { time: '2:02 PM', title: 'RB26 (25430) -- Mainz Hbf → Spay', description: 'Direction Köln Messe/Deutz. Board at Mainz Hbf, Platform 2a. Arrive Spay 3:17 PM, Platform 1.' },
        ],
        tips: [],
      },
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
        icon: 'wine',
        category: 'Tour',
        cost: null,
        summary: 'A self-planned day combining the KD (Köln-Düsseldorfer) Rhine line cruise with a wine tasting lunch in Bacharach, one of the prettiest wine towns on the Middle Rhine. No car needed. Round trip runs about 8-8.5 hours door-to-door.',
        startingPoint: "Rheinufer 8, Spay, Rhineland-Palatinate, 56322 Germany -- the holiday house. Boppard's KD landing stage is about 3 km away: a 35-40 min walk along the riverside path, or a 5-10 min taxi ride.",
        startDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=Bootsanlegestelle%20Boppard%2C%20Rheinallee%2C%20Boppard%2C%20Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=50.232917,7.5898717&destination=50.232917,7.5898717&waypoints=50.0590983,7.7689488%7C50.0584898,7.7682846%7C50.0603334,7.7680244%7C50.0590983,7.7689488&travelmode=walking',
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
        icon: 'castle',
        category: 'Tour',
        cost: null,
        summary: "A car-free castle-and-wine day: a direct KD boat to Braubach, a guided tour through the Rhine's only never-conquered castle, a train back through Koblenz, and a wine tasting a short walk from the house to close out the day.",
        startingPoint: "Rheinufer 8, Spay, Rhineland-Palatinate, 56322 Germany. Boppard's KD landing stage / train station is about 3 km away (35-40 min walk or 5-10 min taxi). Weingut Weingart is less than 1 km from the house (~15 min walk).",
        startDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=Bootsanlegestelle%20Boppard%2C%20Rheinallee%2C%20Boppard%2C%20Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=50.232917,7.5898717&destination=50.2499526,7.6363986&waypoints=50.2709793,7.6450185%7C50.271987,7.6493885%7C50.27414,7.643187%7C50.231406,7.586084&travelmode=walking',
        events: [
          { time: '9:30-9:35 AM', title: 'Leave the house', description: 'Rheinufer 8, Spay -- walk the riverside path to Boppard (~35-40 min) or taxi (~5-10 min).' },
          { time: '10:00 AM', title: 'Boppard KD Landing Stage', description: 'Arrive with buffer. Buy tickets at the kiosk.' },
          { time: '10:15 AM', title: 'Depart Boppard -> Braubach', description: 'Direct KD boat, no transfer, ~30 min scenic ride. Confirm this sailing on k-d.com nearer the date.' },
          { time: '10:45 AM', title: 'Arrive Braubach', description: 'Disembark and walk into town.' },
          { time: '11:00 AM', title: 'Lunch / explore old town', description: 'NH Asian Cuisine & Sushi is open Thu 12-9pm. Otherwise browse the timber-framed old town before the climb.' },
          { time: '12:30 PM', title: 'Walk up to Marksburg Castle', description: '~25-30 min uphill walk, switchbacks. Buy castle tickets on arrival (guided-tour-only access).' },
          { time: '1:00 PM', title: 'Marksburg Castle -- English Guided Tour', description: "50 min tour, daily English tour at 1pm (also 4pm) through October. Kitchen, armory, wine cellar, chapel, knights' hall. $12-15/adult." },
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
    travel: { mode: 'train', time: '6h 38m', cost: null },
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
      {
        id: 'day-09-travel',
        name: 'Train: Spay → Berlin',
        icon: 'train',
        category: 'Travel',
        cost: null,
        summary: 'Two-leg Deutsche Bahn journey: regional train to Köln, then ICE to Berlin.',
        startingPoint: 'Spay, Platform 1',
        directionsUrl: 'https://int.bahn.de/en/buchung/start?vbid=a4828bbe-7ab6-454f-b5f3-d1f1400d98d7',
        linkLabel: 'View train tickets',
        events: [
          { time: '10:17 AM', title: 'RB26 (25420) -- Spay → Köln Hbf', description: 'Direction Köln Messe/Deutz. Board at Spay, Platform 1. Arrive Köln Hbf 12:02 PM, Platform 1 A-C.' },
          { time: '12:44 PM', title: 'ICE 559 -- Köln Hbf → Berlin Hbf', description: 'Direction Berlin Südkreuz. Board at Köln Hbf, Platform 2 A-C. Arrive Berlin Hbf 4:55 PM.' },
        ],
        tips: [],
      },
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
      {
        id: 'day-10-bike-tour',
        name: 'The Beauty of Berlin by Bike Tour',
        icon: 'bike',
        category: 'Tour',
        cost: 510.51,
        summary: 'Withlocals guided bike tour with host Boyd ("The Cool History Teacher"). 3 hours, 8 guests. Booking #14164417.',
        startingPoint: 'Berlin on Bike, corner Dircksenstrasse (under the railway bridge)',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Berlin%20on%20Bike%2C%20Dircksenstrasse%2C%20Berlin%2C%20Germany',
        events: [
          { time: '10:00 AM', title: 'The Beauty of Berlin by Bike Tour', description: 'Meet host Boyd (+49 176 49223079) at Berlin on Bike, corner Dircksenstrasse, under the railway bridge. 3-hour tour, 8 guests.' },
        ],
        tips: [],
      },
      { id: 'day-10-disco', name: 'Disco', icon: 'disco', category: 'Nightlife', cost: null, summary: '', startingPoint: null, events: [], tips: [] },
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
    notes: '',
    title: 'Berlin City Walk',
    activities: [
      {
        id: 'day-11-berlin-walk-1',
        name: 'Berlin Walk: Reichstag → Brandenburg Gate',
        tabLabel: 'Phase 1',
        icon: 'walk',
        category: 'Tour',
        cost: null,
        summary: "Phase 1 of a self-guided ~2.5 km walk through the heart of Berlin (Rick Steves' Berlin City Walk). This leg covers the Reichstag, Brandenburg Gate, and the Holocaust Memorial. Continue with the next two tabs for the rest of the route to Alexanderplatz.",
        startingPoint: 'Platz der Republik, in front of the Reichstag, Berlin, Germany',
        startDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=Reichstag%20Building%2C%20Platz%20der%20Republik%201%2C%2011011%20Berlin%2C%20Germany',
        startDirectionsLabel: 'Get directions to the Reichstag',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=52.5186,13.3762&destination=52.5096,13.3809&waypoints=52.5180,13.3768%7C52.5183,13.3765%7C52.5163,13.3777%7C52.5155,13.3740%7C52.5163,13.3785%7C52.5138,13.3785&travelmode=walking',
        linkLabel: 'Get directions: Phase 1',
        events: [
          { time: '9:00 AM', title: 'Leave the Berlin stay', description: 'Head to Platz der Republik via U-Bahn (Bundestag, U55) or S-Bahn (Brandenburger Tor) -- about 20-25 min from Schleiermacherstraße.' },
          { time: '9:30 AM', title: 'Reichstag', description: "Home to the German Bundestag since 1999, this 1894 building survived a devastating 1933 fire, WWII bombing, and decades divided by the Berlin Wall before Norman Foster's glass dome crowned its post-reunification restoration.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Reichstag_building' },
          { time: '9:40 AM', title: 'Memorial to Politicians Who Opposed Hitler', description: "A row of cast-iron plaques along the Reichstag's northern edge honors the 96 Reichstag members murdered by the Nazi regime for their opposition, each engraved with a name, party, and date of death.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Memorial_to_the_Murdered_Members_of_the_Reichstag' },
          { time: '9:45 AM', title: 'Berlin Wall Victims Memorial', description: 'White crosses along the Spree riverbank commemorate those killed attempting to cross the death strip that ran directly behind the Reichstag from 1961 to 1989.', wikipediaUrl: 'https://en.wikipedia.org/wiki/White_Crosses' },
          { time: '9:55 AM', title: 'Brandenburg Gate', description: 'Completed in 1791 as a Prussian city gate topped by the goddess Quadriga, this neoclassical landmark became the enduring symbol of a divided and later reunified Berlin.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Brandenburg_Gate' },
          { time: '10:05 AM', title: 'Tiergarten', description: "Once royal hunting grounds, this sprawling 520-acre park now forms Berlin's green lung, stretching west from the Brandenburg Gate.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Tiergarten_(park)' },
          { time: '10:15 AM', title: 'Pariser Platz', description: "Rebuilt after being leveled in WWII and left as a windswept no-man's-land during the Cold War, this stately square in front of the Gate is again ringed by embassies and the historic Hotel Adlon.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Pariser_Platz' },
          { time: '10:25 AM', title: 'Memorial to the Murdered Jews of Europe', description: "Dedicated in 2005, Peter Eisenman's field of 2,711 concrete slabs of varying height creates a deliberately disorienting space remembering the six million Jewish victims of the Holocaust.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Memorial_to_the_Murdered_Jews_of_Europe' },
          { time: '10:40 AM', title: "Site of Hitler's Bunker", description: 'An unmarked parking lot on Gertrud-Kolmar-Strasse sits atop the bunker where Hitler married Eva Braun and took his own life on April 30, 1945; only a small information placard marks the spot.', wikipediaUrl: 'https://en.wikipedia.org/wiki/The_Reich_Chancellery_and_F%C3%BChrerbunker_Complex' },
        ],
        tips: [
          "Start at Platz der Republik in front of the Reichstag, reachable via the Bundestag or Brandenburger Tor U/S-Bahn stations. The walk only passes the Reichstag's exterior, so no advance dome reservation is needed unless you want to go inside separately.",
          "Full walk (all 3 phases) is ~2.5 km and runs 2.5-3 hours at an easy pace -- longer if you linger at the Holocaust Memorial or Museum Island.",
          'Wear comfortable shoes for cobblestones and long open stretches with little shade.',
        ],
      },
      {
        id: 'day-11-berlin-walk-2',
        name: 'Berlin Walk: Unter den Linden → Museum Island',
        tabLabel: 'Phase 2',
        icon: 'walk',
        category: 'Tour',
        cost: null,
        summary: 'Phase 2, continuing east from Wilhelmstrasse along Unter den Linden past Bebelplatz and Neue Wache to Museum Island.',
        startingPoint: "Wilhelmstrasse, near the site of Hitler's bunker, Berlin, Germany",
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=52.5107,13.3822&destination=52.5170,13.4023&waypoints=52.5163,13.3815%7C52.5164,13.3796%7C52.5170,13.3878%7C52.5170,13.3888%7C52.5164,13.3925%7C52.5177,13.3968&travelmode=walking',
        linkLabel: 'Get directions: Phase 2',
        events: [
          { time: '10:50 AM', title: 'Wilhelmstrasse', description: "Once the address of the Reich Chancellery and the nerve center of Nazi Germany's government, this street is now lined with modern apartments and ministries.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Wilhelmstrasse' },
          { time: '11:00 AM', title: 'Unter den Linden', description: "Berlin's grand central boulevard, planted with linden trees since the 17th century, has linked the Brandenburg Gate to the royal palace for over 300 years.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Unter_den_Linden' },
          { time: '11:05 AM', title: 'Brandenburger Tor S-Bahn Station', description: "This transit hub sits atop one of the city's most storied crossing points, a short walk from where East and West Berlin were once sealed off from each other.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Berlin_Brandenburger_Tor_station' },
          { time: '11:10 AM', title: 'Russian Embassy', description: 'The Soviet Union built this monumental embassy, the largest diplomatic mission in Cold War-era Berlin, on Unter den Linden in the early 1950s as a statement of power.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Embassy_of_Russia,_Berlin' },
          { time: '11:20 AM', title: 'Friedrichstrasse', description: "Historically Berlin's most fashionable shopping and theater street, this bustling crossroads has been rebuilt and reinvented many times over.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Friedrichstra%C3%9Fe' },
          { time: '11:25 AM', title: 'Bebelplatz', description: 'On the night of May 10, 1933, Nazi students burned some 20,000 "un-German" books in this square; a glass floor panel now reveals a haunting installation of empty white bookshelves below.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Bebelplatz' },
          { time: '11:35 AM', title: 'Neue Wache', description: "Karl Friedrich Schinkel's 1818 royal guardhouse now serves as Germany's central memorial to victims of war and tyranny, sheltering an enlarged cast of Käthe Kollwitz's \"Mother with Her Dead Son\" beneath an open oculus.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Neue_Wache' },
          { time: '11:45 AM', title: 'Museum Island & Humboldt Forum', description: "The reconstructed Berlin Palace, once home to Prussian kings, now houses the Humboldt Forum's collections of non-European art and culture, completed in 2020.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Humboldt_Forum' },
        ],
        tips: [
          "The walk only passes Museum Island's museums from the outside -- if you want to actually tour the Pergamon, Altes Museum, or Berlin Cathedral, plan a separate visit, since each easily deserves 1-2 hours on its own.",
        ],
      },
      {
        id: 'day-11-berlin-walk-3',
        name: 'Berlin Walk: Museum Island → Alexanderplatz',
        tabLabel: 'Phase 3',
        icon: 'walk',
        category: 'Tour',
        cost: null,
        summary: 'Phase 3, crossing the Spree into the Nikolai Quarter and finishing at Alexanderplatz beneath the TV Tower.',
        startingPoint: 'Museum Island (Berlin Cathedral / Altes Museum area), Berlin, Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=52.5192,13.4010&destination=52.5219,13.4132&waypoints=52.5205,13.4040%7C52.5209,13.4079%7C52.5215,13.4090%7C52.5211,13.4098%7C52.5208,13.4094&travelmode=walking',
        linkLabel: 'Get directions: Phase 3',
        events: [
          { time: '11:55 AM', title: 'Museum Island Sights', description: 'This UNESCO World Heritage complex gathers five major museums, including the Pergamon and Altes Museum, alongside the domed Berlin Cathedral.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Museum_Island' },
          { time: '12:05 PM', title: 'Spree River', description: "Berlin grew up along this modest river, whose bridges and canals still shape the city's geography much as they did when medieval Cölln and Berlin first faced each other across its banks.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Spree_(river)' },
          { time: '12:10 PM', title: 'Marx & Engels Statues', description: "Erected in 1986 in the GDR-era Marx-Engels-Forum, these bronze figures of communism's founding theorists remain a popular, if ironic, photo stop today.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Marx-Engels_Forum' },
          { time: '12:15 PM', title: 'Karl-Liebknecht-Strasse & Plattenbau', description: 'Named for a socialist leader killed in 1919, this broad avenue is flanked by prefabricated "Plattenbau" apartment blocks characteristic of East German urban planning from the 1960s-80s.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Plattenbau' },
          { time: '12:20 PM', title: "Martin Luther Statue & St. Mary's Church", description: "Berlin's second-oldest church, dating to around 1270, stands watch over an 1895 statue of the Reformation leader.", wikipediaUrl: "https://en.wikipedia.org/wiki/St._Mary's_Church,_Berlin" },
          { time: '12:25 PM', title: 'TV Tower', description: 'Built by the East German government in 1969 to showcase socialist engineering, this 368-meter spire remains the tallest structure in Germany, with an observation deck and revolving restaurant.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Fernsehturm_Berlin' },
          { time: '12:30 PM', title: 'Alexanderplatz', description: "Named for Russian Tsar Alexander I after his 1805 visit, this vast plaza has long served as Berlin's commercial hub, still anchored by its iconic World Time Clock. Walk ends here.", wikipediaUrl: 'https://en.wikipedia.org/wiki/Alexanderplatz' },
        ],
        tips: [
          'Walk complete -- Alexanderplatz has plenty of options for a late lunch, or ride the TV Tower elevator up if the line looks manageable.',
        ],
      },
    ],
  },
  {
    id: 'day-12',
    date: '2026-09-28',
    dayNumber: 12,
    vacayDay: 11,
    cityDay: 'Berlin',
    cityNight: 'Copenhagen',
    isTravelDay: true,
    travel: { mode: 'flight', time: null, cost: null },
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
    activities: [
      {
        id: 'day-12-to-airport',
        name: 'To Berlin Brandenburg Airport',
        icon: 'train',
        category: 'Travel',
        cost: null,
        summary: 'Head to BER, Terminal 1, in time for SK 1678\'s 1:50 PM latest check-in.',
        startingPoint: 'Schleiermacherstraße 12, Berlin, Berlin 10961, Germany',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=52.496606592421514,13.397539765422684&destination=52.3667,13.5033&travelmode=transit',
        linkLabel: 'Get directions to the airport',
        events: [
          { time: '~1:00 PM', title: 'Leave the Berlin stay', description: 'Depart Schleiermacherstraße 12 for BER Airport, Terminal 1. Latest check-in for SK 1678 is 1:50 PM; boarding pass required at departure from Germany.' },
        ],
        tips: [],
      },
      {
        id: 'day-12-flight',
        name: 'SK 1678: Berlin → Copenhagen',
        icon: 'flight',
        category: 'Travel',
        cost: 307.6,
        summary: 'Scandinavian Airlines, Berlin Brandenburg (BER) → Copenhagen Kastrup (CPH). Booking XKF32N, ticket 117-2548058792. $307.60 is Aaron\'s fare -- confirm other travelers\' tickets separately.',
        startingPoint: 'Berlin Brandenburg Airport (BER), Terminal 1',
        events: [
          { time: '2:35 PM', title: 'Depart Berlin Brandenburg (BER), Terminal 1', description: 'SK 1678, Scandinavian Airlines. Refreshments for purchase onboard. 1 checked bag included.' },
          { time: '3:35 PM', title: 'Arrive Copenhagen Kastrup (CPH)', description: 'Flight duration ~1 hr.' },
        ],
        tips: [],
      },
      {
        id: 'day-12-to-stay',
        name: 'To Copenhagen Stay',
        icon: 'train',
        category: 'Travel',
        cost: null,
        summary: 'From CPH (Kastrup) to Home in Copenhagen. Check-in from 11:00 AM.',
        startingPoint: 'Copenhagen Airport (CPH), Denmark',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=55.6181,12.6561&destination=55.678839448590715,12.590591724485037&travelmode=transit',
        linkLabel: 'Get directions to the stay',
        events: [
          { time: '~4:00 PM', title: 'Head to Home in Copenhagen', description: 'From Copenhagen Kastrup (CPH) to Cort Adelers Gade 12A. Check-in already open on arrival (from 11:00 AM).' },
        ],
        tips: [],
      },
    ],
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
    notes: 'Otherwise free -- explore Copenhagen at your own pace.',
    activities: [
      {
        id: 'day-13-bike-tour',
        name: 'Copenhagen Highlights 3 Hour Bike Tour with local Guide',
        icon: 'bike',
        category: 'Tour',
        cost: 504.00,
        summary: 'Viator-booked guided bike tour with Tropical Bikes. 3 hours, 8 guests. Booking ref #1430833891, confirmation #1813033821.',
        startingPoint: 'Tropical Bikes, Vester Voldgade 2, 1552 Copenhagen, Denmark',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Tropical%20Bikes%2C%20Vester%20Voldgade%202%2C%20Copenhagen%2C%20Denmark',
        linkLabel: 'Get directions to the meeting place',
        events: [
          { time: '11:00 AM', title: 'Copenhagen Highlights 3 Hour Bike Tour', description: 'Meet Tropical Bikes (+45 50 32 11 00) at Vester Voldgade 2, Copenhagen. 3-hour tour, 8 guests. Mobile ticket accepted; full refund if cancelled 24+ hours ahead.' },
        ],
        tips: [],
      },
      {
        id: 'day-13-host-dinner',
        name: 'Dinner at Høst',
        icon: 'dining',
        category: 'Dining',
        cost: null,
        summary: 'Table for 7, held 6:30-8:45 PM. Celebrating three birthdays (two 40ths!). Booking #14509794.',
        startingPoint: 'Høst, Nørre Farimagsgade 41, 1364 København K, Denmark',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=H%C3%B8st%2C%20N%C3%B8rre%20Farimagsgade%2041%2C%201364%20K%C3%B8benhavn%20K%2C%20Denmark',
        events: [
          { time: '6:30 PM', title: 'Dinner at Høst', description: 'Table held until 8:45 PM. Cancel before 1PM same-day to avoid a ~$36/person no-show fee. Phone +45 89 93 84 09.' },
        ],
        tips: [],
      },
    ],
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
    notes: '',
    activities: [
      {
        id: 'day-14-boat-tour',
        name: 'Discover Copenhagen Private Boat Tour Experience',
        icon: 'boat',
        category: 'Tour',
        cost: 552.62,
        summary: 'Viator-booked private 2-hour luxury canal cruise aboard FREYJA with Captain Denis, including a swim stop. 8 guests. Booking ref #BR-1431187307, itinerary #1813385539.',
        startingPoint: 'Black Sign 1, floating dock beside the Royal Danish Theatre (Skuespilhuset), opposite Paper Island, Copenhagen',
        directionsUrl: 'https://maps.app.goo.gl/N4CkZvbYhX3pbcJd7',
        linkLabel: 'Get directions to the meeting point',
        events: [
          { time: '9:30 AM', title: 'Discover Copenhagen Private Boat Tour Experience', description: 'Meet Captain Denis (+45 9196 0090) at the black Sign 1 on the floating dock, next to the Stromma Canal Tours departure point -- do not queue with Stromma. 2-hour private cruise, return 11:30 AM.' },
        ],
        tips: [],
      },
      {
        id: 'day-14-schonnemann-dinner',
        name: 'Lunch at Restaurant Schønnemann',
        icon: 'dining',
        category: 'Dining',
        cost: null,
        summary: 'A la carte, table for 8. Booking ID #62498751.',
        startingPoint: 'Restaurant Schønnemann, Hauser Plads 16-18, 1127 København K, Denmark',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Restaurant%20Sch%C3%B8nnemann%2C%20Hauser%20Plads%2016-18%2C%201127%20K%C3%B8benhavn%20K%2C%20Denmark',
        events: [
          { time: '2:15 PM', title: 'Lunch at Restaurant Schønnemann', description: 'A la carte, table for 8. Booking ID #62498751.' },
        ],
        tips: [],
      },
    ],
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
      {
        id: 'day-15-to-airport',
        name: 'To Copenhagen Airport',
        icon: 'train',
        category: 'Travel',
        cost: null,
        summary: 'From Home in Copenhagen to CPH (Kastrup) for the return flights -- SK 935 to San Francisco, LX 1267 to Washington DC.',
        startingPoint: 'Cort Adelers Gade 12A, 1053 København, Denmark',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=55.678839448590715,12.590591724485037&destination=55.6181,12.6561&travelmode=transit',
        linkLabel: 'Get directions to the airport',
        events: [
          { time: '~10:30 AM', title: 'Leave the Copenhagen stay', description: 'Head to CPH Airport, Departure Terminal 3, ahead of the 12:45 PM SK 935 departure (Selena should allow enough time for the earlier 9:40 AM LX 1267 departure).' },
        ],
        tips: [],
      },
      {
        id: 'day-15-flight',
        name: 'SK 935: Copenhagen → San Francisco',
        icon: 'flight',
        category: 'Travel',
        cost: null,
        summary: 'Scandinavian Airlines, direct flight. Booking Z8WWPP (Aaron & Blake) -- round-trip fare already recorded on the Sep 17 outbound leg. Kaitlyn and Josh are on separate tickets for this flight; Mark is not on the return.',
        startingPoint: 'Copenhagen Airport (CPH), Departure Terminal 3',
        travelers: ['Aaron Menkens', 'Blake Thomson', 'Kaitlyn Romain', 'Josh Romain'],
        events: [
          { time: '12:45 PM', title: 'SK 935 -- Copenhagen (CPH) → San Francisco (SFO)', description: 'Scandinavian Airlines, Airbus A350-900. Departure Terminal 3. 10h 55m nonstop. Seats 31F/31J (Aaron/Blake). Meal included, 2 checked bags.' },
          { time: '2:40 PM', title: 'Arrive San Francisco (SFO)', description: 'Arrival Terminal I.' },
        ],
        tips: [],
      },
      {
        id: 'day-15-flight-selena',
        name: 'LX 1267 + LX 72: Copenhagen → Washington DC (via Zurich)',
        icon: 'flight',
        category: 'Travel',
        cost: null,
        summary: 'One-stop itinerary via Zurich, on Star Alliance carriers Helvetic Airways and SWISS.',
        startingPoint: 'Copenhagen Airport (CPH), Denmark',
        travelers: ['Selena Russell'],
        events: [
          { time: '9:40 AM', title: 'LX 1267 -- Copenhagen (CPH) → Zurich (ZRH)', description: 'Operated by Helvetic Airways. 1h 55m. Arrive 11:35 AM.' },
          { time: '1:05 PM', title: 'LX 72 -- Zurich (ZRH) → Washington Dulles (IAD)', description: 'Operated by SWISS International Air Lines. 9h 40m nonstop. Arrive 4:45 PM.' },
        ],
        tips: [],
      },
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
        shortLabel: CITIES[slug].shortLabel,
        color: CITIES[slug].color,
        onColor: CITIES[slug].onColor,
        textColor: CITIES[slug].textColor,
        tint: CITIES[slug].tint,
        coords: CITIES[slug].coords,
        days: locationDays,
        dateRange: { start: locationDays[0].date, end: locationDays[locationDays.length - 1].date },
        arrival: locationDays[0].isTravelDay ? locationDays[0] : null,
        lodging: locationDays.find((d) => d.lodging)?.lodging ?? null,
      }
    })
}
