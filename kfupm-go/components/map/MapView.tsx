"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { CampusLocation, GeolocationState, RouteSummary } from "@/types/location";
import { CATEGORY_META } from "@/lib/categories";
import { CAMPUS_CENTER } from "@/data/locations";

const ROUTE_SOURCE_ID = "walking-route";
const ROUTE_LAYER_ID = "walking-route-line";

interface MapViewProps {
  locations: CampusLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (location: CampusLocation) => void;
  geolocation: GeolocationState;
  route: RouteSummary | null;
  /** Bumped whenever the parent wants the camera to fly to the selected location. */
  flyToToken: number;
  /** Bumped whenever the parent wants the camera to recenter on the user. */
  centerOnMeToken: number;
}

export default function MapView({
  locations,
  selectedLocationId,
  onSelectLocation,
  geolocation,
  route,
  flyToToken,
  centerOnMeToken,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const tokenMissing = !process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Initialize map once
  useEffect(() => {
    if (tokenMissing || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [CAMPUS_CENTER.longitude, CAMPUS_CENTER.latitude],
      zoom: 15.5,
      pitchWithRotate: false,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", () => {
      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007E40", "line-width": 5, "line-opacity": 0.85 },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
     
  }, [tokenMissing]);

  // Render location markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current.values()) marker.remove();
    markersRef.current.clear();

    for (const location of locations) {
      const meta = CATEGORY_META[location.category];

      // IMPORTANT: Mapbox GL positions markers by writing its own `transform`
      // directly onto the element passed to `new mapboxgl.Marker({ element })`.
      // If we also put our rotate/animation transform on that same element,
      // Mapbox's positioning transform overwrites ours and the marker can
      // render invisible or mis-shapen. Fix: use a plain anchor element for
      // Mapbox to position, and put all visual styling on a child element.
      const anchorEl = document.createElement("button");
      anchorEl.setAttribute("aria-label", location.name);
      anchorEl.className = "campus-marker-anchor";

      const pinEl = document.createElement("span");
      pinEl.className = "campus-marker";
      pinEl.style.setProperty("--marker-color", meta.color);
      if (location.id === selectedLocationId) pinEl.classList.add("campus-marker--selected");
      anchorEl.appendChild(pinEl);

      anchorEl.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectLocation(location);
      });

      const marker = new mapboxgl.Marker({ element: anchorEl, anchor: "bottom" })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);

      markersRef.current.set(location.id, marker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, selectedLocationId]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (geolocation.status !== "granted") {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }

    const lngLat: [number, number] = [geolocation.longitude, geolocation.latitude];

    if (!userMarkerRef.current) {
      const anchorEl = document.createElement("div");
      anchorEl.className = "user-location-anchor";
      const dotEl = document.createElement("div");
      dotEl.className = "user-location-dot";
      anchorEl.appendChild(dotEl);
      userMarkerRef.current = new mapboxgl.Marker({ element: anchorEl, anchor: "center" }).setLngLat(lngLat).addTo(map);
    } else {
      userMarkerRef.current.setLngLat(lngLat);
    }
  }, [geolocation]);

  // Fly to selected location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocationId || flyToToken === 0) return;
    const location = locations.find((l) => l.id === selectedLocationId);
    if (!location) return;
    map.flyTo({ center: [location.longitude, location.latitude], zoom: 17, duration: 900 });
  }, [flyToToken, locations, selectedLocationId]);

  // Center on user
  useEffect(() => {
    const map = mapRef.current;
    if (!map || centerOnMeToken === 0 || geolocation.status !== "granted") return;
    map.flyTo({ center: [geolocation.longitude, geolocation.latitude], zoom: 17, duration: 700 });
  }, [centerOnMeToken, geolocation]);

  // Draw / clear route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyRoute = () => {
      const source = map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      if (!source) return;

      if (!route) {
        source.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } });
        return;
      }

      source.setData({ type: "Feature", properties: {}, geometry: route.geometry });

      const coords = route.geometry.coordinates as [number, number][];
      if (coords.length > 1) {
        const bounds = coords.reduce(
          (b, c) => b.extend(c as [number, number]),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.fitBounds(bounds, { padding: { top: 120, bottom: 260, left: 60, right: 60 }, duration: 800 });
      }
    };

    if (map.isStyleLoaded()) applyRoute();
    else map.once("load", applyRoute);
  }, [route]);

  if (tokenMissing) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-100 p-6 text-center">
        <div className="max-w-xs space-y-2">
          <p className="text-sm font-semibold text-neutral-800">Mapbox token missing</p>
          <p className="text-xs text-neutral-500">
            Add <code className="rounded bg-neutral-200 px-1 py-0.5">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to
            your <code className="rounded bg-neutral-200 px-1 py-0.5">.env.local</code> file and restart the dev
            server.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
