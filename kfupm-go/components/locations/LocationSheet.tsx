"use client";
import { Heart, Navigation, X, Star, Phone, Clock } from "lucide-react";
import { useState } from "react";
import type { CampusLocation, GeolocationState } from "@/types/location";
import { CATEGORY_META } from "@/lib/categories";
import { distanceMeters, estimateWalkingSeconds, formatDistance, formatDuration, getRoutingTarget } from "@/lib/geo";
interface LocationSheetProps {
  location: CampusLocation;
  geolocation: GeolocationState;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartWalking: () => void;
  onClose: () => void;
  isNavigating: boolean;
}
export default function LocationSheet({
  location,
  geolocation,
  isFavorite,
  onToggleFavorite,
  onStartWalking,
  onClose,
  isNavigating,
}: LocationSheetProps) {
  const meta = CATEGORY_META[location.category];
  const target = getRoutingTarget(location);
  const [photoFailed, setPhotoFailed] = useState(false);
  let estimate: { distance: string; duration: string } | null = null;
  if (geolocation.status === "granted") {
    const meters = distanceMeters(geolocation, target);
    estimate = {
      distance: formatDistance(meters),
      duration: formatDuration(estimateWalkingSeconds(meters)),
    };
  }
  return (
    <div className="rounded-t-3xl bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] sheet-animate dark:bg-neutral-800">
      <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-600" />
      {location.photo && !photoFailed && (
        <div className="relative -mx-5 mb-3 h-36 w-[calc(100%+2.5rem)] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
          {/* Plain <img> (not next/image) with an error fallback: several photos
              are hotlinked from third-party sources we can't verify stay live,
              so a broken link should quietly hide the photo, not show a
              broken-image icon. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={location.photo}
            alt={location.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setPhotoFailed(true)}
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
            >
              {meta.label}
            </span>
            {location.buildingNumber && (
              <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">Building {location.buildingNumber}</span>
            )}
          </div>
          <h2 className="mt-1 truncate text-lg font-bold text-neutral-900 dark:text-white">{location.name}</h2>
          {location.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{location.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label={isFavorite ? "Remove from saved" : "Save location"}
            onClick={onToggleFavorite}
            className="rounded-full p-2 active:bg-neutral-100 dark:active:bg-neutral-700"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400 dark:text-neutral-500"}`} />
          </button>
          <button aria-label="Close" onClick={onClose} className="rounded-full p-2 active:bg-neutral-100 dark:active:bg-neutral-700">
            <X className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
          </button>
        </div>
      </div>
      {estimate && (
        <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <span className="font-bold text-neutral-900 dark:text-white">{estimate.duration}</span> walk · {estimate.distance}
        </p>
      )}
      {(location.rating || location.phone || location.hours) && (
        <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 dark:border-white/10">
          {location.rating && (
            <p className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-100">{location.rating.toFixed(1)}</span> on Google
            </p>
          )}
          {location.hours && location.hours.length > 0 && (
            <div className="flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{location.hours.join(" · ")}</span>
            </div>
          )}
          {location.phone && (
            <a href={`tel:${location.phone}`} className="flex items-center gap-1.5 text-xs text-neutral-600 underline underline-offset-2 dark:text-neutral-300">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {location.phone}
            </a>
          )}
        </div>
      )}
      <button
        onClick={onStartWalking}
        disabled={geolocation.status !== "granted" || isNavigating}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#007E40] py-3.5 text-[15px] font-bold text-white shadow-md shadow-[#007E40]/25 transition-opacity active:opacity-90 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500"
      >
        <Navigation className="h-4.5 w-4.5" />
        {geolocation.status === "granted" ? "Start Walking" : "Enable location to navigate"}
      </button>
    </div>
  );
}
