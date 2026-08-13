import type { CampusLocation, LocationEntrance } from "@/types/location";

const EARTH_RADIUS_M = 6371000;

/** Haversine distance in meters between two lat/lng points. */
export function distanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

/** Average adult walking speed, used only for quick estimates before a route is fetched. */
const WALKING_SPEED_M_PER_S = 1.3;

export function estimateWalkingSeconds(meters: number): number {
  return meters / WALKING_SPEED_M_PER_S;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem ? `${hours} hr ${rem} min` : `${hours} hr`;
}

/** Returns the preferred entrance if present, otherwise the building's main coordinates. */
export function getRoutingTarget(location: CampusLocation): {
  latitude: number;
  longitude: number;
  label?: string;
} {
  const preferred = location.entrances?.find((e) => e.isPreferred);
  const entrance: LocationEntrance | undefined = preferred ?? location.entrances?.[0];
  if (entrance) {
    return { latitude: entrance.latitude, longitude: entrance.longitude, label: entrance.name };
  }
  return { latitude: location.latitude, longitude: location.longitude };
}
