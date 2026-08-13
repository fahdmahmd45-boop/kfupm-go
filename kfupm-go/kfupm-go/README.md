# KFUPM GO

A mobile-first campus navigation app for King Fahd University of Petroleum & Minerals (KFUPM), Dhahran, Saudi Arabia.

Open the app → search for a destination → select it → see it on the map → tap **Start Walking** → get a live walking route from your current position.

> ⚠️ **All campus location data in `data/locations.ts` is SAMPLE / PLACEHOLDER data.** Building numbers, names, descriptions, and coordinates were generated for development only and are **not** verified KFUPM information. The map is centered on KFUPM's real, publicly known campus location, but every individual pin needs to be replaced with verified data before this is used by real students. See [Adding a new building](#adding-a-new-building) below.

---

## Tech stack

- **Next.js 15 (App Router)** + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Mapbox GL JS** for the map, **Mapbox Directions API** (`mapbox/walking`) for routes
- Browser **Geolocation API** for live position
- Local TypeScript dataset (`data/locations.ts`) — no database yet, by design
- **localStorage** for saved/favorite locations (no login required for MVP)

No backend, database, or auth system is included. The code is structured so a database (e.g. Supabase/PostgreSQL) can replace `data/locations.ts` later without touching the UI — see [Architecture & future database](#architecture--future-database).

---

## Getting started

```bash
npm install
cp .env.example .env.local
# paste your Mapbox public token into .env.local (see below)
npm run dev
```

Open http://localhost:3000 on your phone or in a mobile-sized browser viewport. Allow location access when prompted for the full experience.

### Mapbox setup

1. Create a free account at https://account.mapbox.com/
2. Go to https://account.mapbox.com/access-tokens/ and copy your **Default public token** (starts with `pk.`)
3. Copy `.env.example` to `.env.local` and paste the token:

   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
   ```
4. Restart the dev server.

The token is a **public** token — safe to expose client-side (it's prefixed `NEXT_PUBLIC_` intentionally). Never put a secret/server Mapbox token in this file. Mapbox's free tier covers generous map loads and Directions API requests for development and small deployments.

---

## Project structure

```
app/
  page.tsx            Main map screen (search, categories, sheet, navigation)
  saved/page.tsx      Saved/favorites screen (localStorage)
  explore/page.tsx    Explore placeholder screen
  layout.tsx          Root layout, metadata, viewport
  globals.css         Tailwind + marker/RTL styles

components/
  map/                MapView (Mapbox GL), CenterOnMeButton, GpsStatusBanner
  search/             SearchBar, SearchResults, CategoryChips
  locations/          LocationSheet (bottom sheet with location details)
  navigation/         RouteInfoBar (active walking route bar)
  layout/             BottomNav (Map / Saved / Explore tabs)

data/
  locations.ts        Campus location dataset — SAMPLE DATA, see warning above

lib/
  search.ts           Partial-match search over the local dataset
  geo.ts               Distance/duration formatting, entrance-aware routing target
  directions.ts        Mapbox Directions API client (walking)
  categories.ts         Category labels/colors/icons

hooks/
  useGeolocation.ts    Wraps browser Geolocation with granted/denied/unavailable states
  useFavorites.ts      Favorites persisted to localStorage

types/
  location.ts          CampusLocation, LocationEntrance, RouteSummary, etc.
```

---

## How campus location data works

Every location lives in `data/locations.ts` as a `CampusLocation` object:

```ts
{
  id: "sample-b22",
  buildingNumber: "22",
  name: "Building 22 (SAMPLE)",
  shortName: "B22",
  category: "academic",
  description: "...",
  latitude: 26.3071,
  longitude: 50.1408,
  entrances: [
    { name: "Main Entrance (SAMPLE)", latitude: 26.30715, longitude: 50.14085, isPreferred: true },
  ],
  keywords: ["b22", "22", "engineering"],
  isSampleData: true,
}
```

Search checks `name`, `buildingNumber`, `shortName`, `keywords`, and `category` — so add a few relevant `keywords` (synonyms, common abbreviations, Arabic transliterations) to make a location easy to find.

### Adding a new building

1. Open `data/locations.ts`.
2. Add a new object to the `campusLocations` array with a unique `id`.
3. Use **real, verified** `latitude`/`longitude` (satellite imagery or on-the-ground GPS — do not estimate).
4. Set `isSampleData: false` (or omit it) once the entry is verified.
5. Save — the map, search, and category filters all pick it up automatically. No other code changes needed.

### Adding/editing an entrance

Add entries to the location's `entrances` array. Mark the entrance students should actually be routed to with `isPreferred: true` — this is what `lib/geo.ts#getRoutingTarget` uses as the walking destination instead of the building's center point (important for large buildings where the center point isn't a usable entrance).

```ts
entrances: [
  { name: "Main Gate", latitude: 26.xxxxx, longitude: 50.xxxxx, isPreferred: true },
  { name: "Side Entrance (Parking Lot)", latitude: 26.xxxxx, longitude: 50.xxxxx },
]
```

If no `entrances` are provided, routing falls back to the building's `latitude`/`longitude`.

---

## How routing works

1. The student's live position comes from `useGeolocation` (browser Geolocation API, watched continuously).
2. On **Start Walking**, `lib/directions.ts` calls the Mapbox Directions API (`mapbox/walking` profile) with the student's current coordinates as origin and the selected location's preferred entrance (or center point) as destination.
3. The returned GeoJSON route geometry is drawn on the map, and distance/duration are shown in the route bar.
4. **End Route** clears the route and returns to normal map browsing.

This MVP intentionally uses Mapbox's general-purpose walking directions, which route along real streets/paths but don't know about KFUPM-specific shortcuts, covered walkways, or building interiors.

### Future: custom campus routing graph

All routing logic is isolated in `lib/directions.ts`, and the `RouteSummary` type exists specifically so it can later be swapped for a custom pedestrian routing engine built from a graph of sidewalks, shortcuts, stairs, and covered walkways — without changing any UI component. `fetchWalkingRoute()` is the only function that needs a new implementation.

---

## Architecture & future database

`data/locations.ts` currently exports a plain array. To move to Supabase/PostgreSQL later:

1. Create a `locations` table matching the `CampusLocation` shape (entrances can be a JSON column or a related table).
2. Replace the static import in `app/page.tsx` with a fetch (e.g. a Supabase client call in a server component, or a client-side fetch on load).
3. Everything downstream (search, markers, sheet, favorites) already operates on `CampusLocation[]`, so no other files need to change.

Favorites currently live in `localStorage` (`hooks/useFavorites.ts`) since there's no auth system yet. When accounts are added, swap the storage calls for API calls keyed by user id.

---

## Features NOT built yet (by design)

This MVP intentionally excludes the following so the core journey (search → select → walk) stays polished and reliable. The architecture leaves room for all of them later:

- Class schedule integration / "Take me to my next class"
- Leave-now notifications
- Indoor navigation, classroom-level search
- Custom pedestrian routing graph (shortcuts, stairs, covered walkways)
- Crowdsourced shortcut reporting
- Accessibility-friendly route options
- Shuttle/bus information, campus events
- Full Arabic localization (structural RTL support exists — see `[dir="rtl"]` in `globals.css` — but the MVP UI copy is English-only)
- Native iOS/Android apps
- Admin dashboard

---

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint
```
