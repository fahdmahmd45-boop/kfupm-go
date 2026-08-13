export type LocationCategory =
  | "academic"
  | "food"
  | "parking"
  | "mosque"
  | "study"
  | "service"
  | "club"
  | "other";

export interface LocationEntrance {
  name: string;
  latitude: number;
  longitude: number;
  /** Mark one entrance as the preferred/default routing target */
  isPreferred?: boolean;
}

export interface CampusLocation {
  id: string;
  buildingNumber?: string;
  name: string;
  shortName?: string;
  category: LocationCategory;
  description?: string;
  latitude: number;
  longitude: number;
  entrances?: LocationEntrance[];
  keywords?: string[];
  /** Optional richer details shown when the location is selected. */
  phone?: string;
  rating?: number;
  hours?: string[];
  /**
   * MVP data flag. All seed locations are placeholders until verified
   * KFUPM coordinates are supplied — see data/locations.ts.
   */
  isSampleData?: boolean;
}

export interface CategoryMeta {
  id: LocationCategory;
  label: string;
  color: string;
  icon: string; // lucide-react icon name, resolved in the marker component
}

export interface RouteSummary {
  distanceMeters: number;
  durationSeconds: number;
  geometry: GeoJSON.LineString;
}

export type GeolocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "granted"; latitude: number; longitude: number; accuracy: number }
  | { status: "denied" }
  | { status: "unavailable"; message: string };
