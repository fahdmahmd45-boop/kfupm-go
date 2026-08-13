"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import CategoryChips from "@/components/search/CategoryChips";
import CenterOnMeButton from "@/components/map/CenterOnMeButton";
import ThemeToggleButton from "@/components/map/ThemeToggleButton";
import GpsStatusBanner from "@/components/map/GpsStatusBanner";
import LocationSheet from "@/components/locations/LocationSheet";
import RouteInfoBar from "@/components/navigation/RouteInfoBar";
import BottomNav from "@/components/layout/BottomNav";
import { campusLocations, CAMPUS_CENTER } from "@/data/locations";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useTheme } from "@/hooks/useTheme";
import { searchLocations } from "@/lib/search";
import { searchNearbyPlaces } from "@/lib/geocode";
import { getRoutingTarget } from "@/lib/geo";
import { fetchWalkingRoute, DirectionsError } from "@/lib/directions";
import type { CampusLocation, LocationCategory, RouteSummary } from "@/types/location";

// Mapbox GL touches window/DOM APIs — load client-side only.
const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<LocationCategory | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [flyToToken, setFlyToToken] = useState(0);
  const [centerOnMeToken, setCenterOnMeToken] = useState(0);

  const [route, setRoute] = useState<RouteSummary | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  const [externalResults, setExternalResults] = useState<CampusLocation[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);

  const { state: geolocation, retry: retryGeolocation } = useGeolocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  const searchResults = useMemo(() => searchLocations(campusLocations, query), [query]);

  const visibleLocations = useMemo(() => {
    if (!activeCategory) return campusLocations;
    return campusLocations.filter((l) => l.category === activeCategory);
  }, [activeCategory]);

  // Fall back to Mapbox Geocoding for anything not in our curated dataset,
  // so search isn't limited to the ~60 locations we've manually added.
  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExternalResults([]);
       
      setExternalLoading(false);
      return;
    }

    let cancelled = false;
     
    setExternalLoading(true);
    const origin = geolocation.status === "granted" ? geolocation : CAMPUS_CENTER;
    const timer = setTimeout(async () => {
      const results = await searchNearbyPlaces(query, origin);
      if (!cancelled) {
        setExternalResults(results);
        setExternalLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, geolocation]);

  function selectLocation(location: CampusLocation) {
    setSelectedLocation(location);
    setSearchOpen(false);
    setQuery("");
    setFlyToToken((t) => t + 1);
  }

  function closeSheet() {
    setSelectedLocation(null);
  }

  async function startWalking() {
    if (!selectedLocation || geolocation.status !== "granted") return;
    setIsRouting(true);
    setRouteError(null);
    try {
      const target = getRoutingTarget(selectedLocation);
      const summary = await fetchWalkingRoute(
        { latitude: geolocation.latitude, longitude: geolocation.longitude },
        target
      );
      setRoute(summary);
    } catch (err) {
      setRouteError(err instanceof DirectionsError ? err.message : "Something went wrong building your route.");
    } finally {
      setIsRouting(false);
    }
  }

  function endRoute() {
    setRoute(null);
    setRouteError(null);
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <MapView
          locations={visibleLocations}
          selectedLocationId={selectedLocation?.id ?? null}
          onSelectLocation={selectLocation}
          geolocation={geolocation}
          route={route}
          flyToToken={flyToToken}
          centerOnMeToken={centerOnMeToken}
        />

        {/* Top floating layer: search + categories + GPS status */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-2.5 px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
          <div className="pointer-events-auto flex items-center gap-2">
            <Image
              src="/kfupm-logo.svg"
              alt="KFUPM"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-xl bg-white/95 p-1.5 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur dark:bg-neutral-800/95 dark:ring-white/10"
            />
            <div className="flex-1">
              <SearchBar value={query} onChange={setQuery} onFocus={() => setSearchOpen(true)} />
            </div>
          </div>

          {searchOpen && query ? (
            <div className="pointer-events-auto">
              <SearchResults
                results={searchResults}
                externalResults={externalResults}
                externalLoading={externalLoading}
                query={query}
                onSelect={selectLocation}
              />
            </div>
          ) : (
            <div className="pointer-events-auto -mx-4">
              <CategoryChips activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>
          )}

          <div className="pointer-events-auto self-start">
            <GpsStatusBanner state={geolocation} onRetry={retryGeolocation} />
          </div>
        </div>

        {/* Floating action buttons, positioned above the sheet/nav */}
        {!searchOpen && (
          <div
            className="pointer-events-auto absolute right-4 z-10 flex flex-col gap-2.5"
            style={{ bottom: selectedLocation || route ? "calc(env(safe-area-inset-bottom) + 190px)" : "24px" }}
          >
            <ThemeToggleButton theme={theme} onClick={toggleTheme} />
            <CenterOnMeButton onClick={() => setCenterOnMeToken((t) => t + 1)} active={geolocation.status === "granted"} />
          </div>
        )}

        {/* Bottom floating layer: route bar or location sheet */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2">
          {route && selectedLocation && (
            <div className="pointer-events-auto mb-2">
              <RouteInfoBar location={selectedLocation} route={route} onEndRoute={endRoute} />
            </div>
          )}

          {routeError && (
            <div className="pointer-events-auto mb-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700 shadow-md ring-1 ring-red-200/60 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-700/40">
              {routeError}
            </div>
          )}

          {selectedLocation && !route && (
            <div className="pointer-events-auto">
              <LocationSheet
                location={selectedLocation}
                geolocation={geolocation}
                isFavorite={isFavorite(selectedLocation.id)}
                onToggleFavorite={() => toggleFavorite(selectedLocation.id)}
                onStartWalking={startWalking}
                onClose={closeSheet}
                isNavigating={isRouting}
              />
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
