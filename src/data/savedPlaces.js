// Named points of interest from the group's shared Google Maps list
// ("Germany Denmark"), keyed by trip location slug. Each place is looked
// up by name + country rather than a hand-typed street address -- Google's
// own geocoder resolves both the static-map pin and the "Open in Maps"
// link, which is safer than us guessing addresses for businesses we can't
// verify. Lodging addresses already covered by tripData.js are excluded
// here to avoid a duplicate pin next to the stay marker.
export const SAVED_PLACES = {
  munich: [
    { name: 'Augustiner Stammhaus', category: 'Bavarian restaurant' },
    { name: 'SAYAQ Adventure Tower', category: 'High ropes course' },
    { name: 'Augustiner Biergarten am Olympiasee', category: 'Beer garden' },
    { name: 'BMW Museum', category: 'Museum' },
    { name: 'BMW Welt', category: 'Museum' },
    { name: 'Viktualienmarkt', category: "Farmers' market" },
    { name: 'Munich Soup Kitchen', category: 'Soup' },
    { name: 'Hofbräuhaus München', category: 'Bavarian restaurant' },
    { name: 'Augustiner Klosterwirt', category: 'Bavarian restaurant' },
    { name: 'Viktualienmarkt Beergarden', category: 'Beer garden' },
    { name: 'Caspar Plautz GbR', category: 'Restaurant' },
    { name: 'Munich Central Station', category: 'Transportation' },
    { name: 'Bavarian Outfitters - Lederhosen & Dirndlverleih', category: 'Clothing store' },
    { name: 'Hofbräu-Festzelt', category: 'Oktoberfest tent' },
    { name: 'Paulaner Brewery Marquee (Armbrustschützenzelt)', category: 'Oktoberfest tent' },
  ],
  rhine: [
    { name: 'Cologne-Düsseldorf Rheinschiffahrt AG', category: 'Boat tour agency' },
  ],
}
