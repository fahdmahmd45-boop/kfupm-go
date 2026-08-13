"use client";

import { AlertTriangle, Loader2, MapPinOff } from "lucide-react";
import type { GeolocationState } from "@/types/location";

export default function GpsStatusBanner({ state, onRetry }: { state: GeolocationState; onRetry: () => void }) {
  if (state.status === "granted" || state.status === "idle") return null;

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2.5 text-xs font-medium text-neutral-600 shadow-md ring-1 ring-black/5 backdrop-blur dark:bg-neutral-800/95 dark:text-neutral-300 dark:ring-white/10">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Finding your location…
      </div>
    );
  }

  if (state.status === "denied") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-800 shadow-md ring-1 ring-amber-200/60 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-700/40">
        <MapPinOff className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1">Location access is off. Enable it in your browser settings to navigate.</span>
        <button onClick={onRetry} className="shrink-0 font-bold underline underline-offset-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700 shadow-md ring-1 ring-red-200/60 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-700/40">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1">{state.message}</span>
      <button onClick={onRetry} className="shrink-0 font-bold underline underline-offset-2">
        Retry
      </button>
    </div>
  );
}
