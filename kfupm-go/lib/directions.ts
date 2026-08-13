import type { RouteSummary } from "@/types/location";

export class DirectionsError extends Error {}

interface DirectionsPoint {
  latitude: number;
  longitude: number;
}

/**
 * Fetches a walking route between two points from the Mapbox Directions API.
 * Throws DirectionsError with a user-friendly message on failure.
 */
export async function fetchWalkingRoute(
  origin: DirectionsPoint,
  destination: DirectionsPoint
): Promise<RouteSummary> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new DirectionsError(
      "Mapbox access token is missing. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file."
    );
  }

  const coords = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/walking/${coords}`);
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("overview", "full");
  url.searchParams.set("access_token", token);

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new DirectionsError("Could not reach the routing service. Check your internet connection.");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new DirectionsError("Mapbox rejected the request. Check your access token.");
    }
    throw new DirectionsError("Could not calculate a walking route right now. Please try again.");
  }

  const data = await response.json();
  const route = data?.routes?.[0];
  if (!route) {
    throw new DirectionsError("No walking route was found to this destination.");
  }

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: route.geometry,
  };
}
