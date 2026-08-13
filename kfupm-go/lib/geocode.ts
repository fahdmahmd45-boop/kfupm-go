import type { CampusLocation } from "@/types/location";

interface MapboxGeocodeFeature {
  id?: string;
  text?: string;
  place_name?: string;
  center: [number, number];
}

/**
 * Falls back to the Mapbox Geocoding API for queries that don't match
 * anything in our curated campus dataset (data/locations.ts). Results are
 * biased toward the campus but can return real places anywhere Mapbox
 * knows about — restaurants, landmarks, streets — not just the ~60
 * locations we've manually verified.
 *
 * Results are shaped as CampusLocation so they can flow through the same
 * map/selection/sheet UI as curated locations. category is always "other"
 * since Mapbox doesn't map cleanly to our campus categories.
 */
export async function searchNearbyPlaces(
  query: string,
  center: { latitude: number; longitude: number }
): Promise<CampusLocation[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token || !query.trim()) return [];

  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("proximity", `${center.longitude},${center.latitude}`);
  url.searchParams.set("limit", "5");
  url.searchParams.set("language", "en");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) return [];
    const data = await response.json();
    const features: MapboxGeocodeFeature[] = data?.features ?? [];

    return features
      .filter((f) => Array.isArray(f.center) && f.center.length === 2)
      .map((f, index) => ({
        id: `mapbox-${f.id ?? index}`,
        name: f.text ?? f.place_name ?? query,
        description: f.place_name,
        category: "other" as const,
        latitude: f.center[1],
        longitude: f.center[0],
      }));
  } catch {
    return [];
  }
}
