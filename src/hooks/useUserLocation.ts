"use client";

import { useEffect, useState } from "react";
import type { LatLng } from "@/lib/geo";

export type UserLocation =
  | { status: "loading" }
  | { status: "granted"; position: LatLng; accuracy: number }
  | { status: "denied" }
  | { status: "unavailable" };

/** Sigue la ubicación del usuario mientras el componente esté montado. */
export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    status: "loading",
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setLocation({ status: "unavailable" }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) =>
        setLocation({
          status: "granted",
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
        }),
      (error) =>
        setLocation({
          status:
            error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
        }),
      { enableHighAccuracy: true, maximumAge: 10_000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}
