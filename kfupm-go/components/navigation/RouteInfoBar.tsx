"use client";

import { Footprints, X } from "lucide-react";
import type { CampusLocation, RouteSummary } from "@/types/location";
import { formatDistance, formatDuration } from "@/lib/geo";

interface RouteInfoBarProps {
  location: CampusLocation;
  route: RouteSummary;
  onEndRoute: () => void;
}

export default function RouteInfoBar({ location, route, onEndRoute }: RouteInfoBarProps) {
  return (
    <div className="rounded-2xl bg-neutral-900 px-5 py-4 text-white shadow-xl shadow-black/20 sheet-animate">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Footprints className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{location.name}</p>
            <p className="text-xs text-white/60">
              {formatDuration(route.durationSeconds)} walk · {formatDistance(route.distanceMeters)}
            </p>
          </div>
        </div>
        <button
          onClick={onEndRoute}
          aria-label="End route"
          className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-bold active:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
          End
        </button>
      </div>
    </div>
  );
}
