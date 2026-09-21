"use client";

import dynamic from "next/dynamic";

// Leaflet usa `window` al importarse, así que el mapa solo existe en el cliente.
const AlarmMap = dynamic(() => import("./AlarmMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-surface-200 text-dark-600">
      Cargando mapa…
    </div>
  ),
});

export default AlarmMap;
