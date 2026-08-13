"use client";

import { useEffect, useRef, useState } from "react";
import type { GeolocationState } from "@/types/location";

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: "idle" });
  const watchId = useRef<number | null>(null);

  const start = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState({ status: "unavailable", message: "This browser does not support location services." });
      return;
    }

    setState({ status: "loading" });

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          status: "granted",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
        } else {
          setState({
            status: "unavailable",
            message: "Your location is temporarily unavailable. Move to an open area and try again.",
          });
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  };

  useEffect(() => {
    // Kick off the location watch on mount. This intentionally updates state
    // (loading -> granted/denied/unavailable) as the async permission/GPS
    // result comes back from the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    start();
    return () => {
      if (watchId.current !== null && typeof navigator !== "undefined") {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
     
  }, []);

  return { state, retry: start };
}
