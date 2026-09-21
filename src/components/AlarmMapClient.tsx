"use client";

import "leaflet/dist/leaflet.css";
import {
  latLngBounds,
  type FitBoundsOptions,
  type Map as LeafletMap,
} from "leaflet";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import { LocateFixed } from "lucide-react";
import { ALARMS_LIST_WIDTH } from "@/components/AlarmsList";
import { alarms, getAlarmPoints, type AlarmPoint } from "@/data/alarms";
import { useUserLocation } from "@/hooks/useUserLocation";

const alarmPoints = alarms.flatMap(getAlarmPoints);

const boundsOf = (points: AlarmPoint[]) =>
  latLngBounds(points.map(({ position }) => [position.lat, position.lng]));

const initialBounds = boundsOf(alarmPoints);

// La lista tapa la franja izquierda: encuadra solo en el área visible.
const visibleArea: FitBoundsOptions = {
  paddingTopLeft: [ALARMS_LIST_WIDTH + 48, 48],
  paddingBottomRight: [48, 48],
};

const USER_COLOR = "#2563eb";

const locationMessages = {
  loading: "Buscando tu ubicación…",
  denied: "Activa el permiso de ubicación para verte en el mapa.",
  unavailable: "No pudimos obtener tu ubicación.",
};

type AlarmMapClientProps = {
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
};

export default function AlarmMapClient({
  selectedId,
  setSelectedId,
}: AlarmMapClientProps) {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const userLocation = useUserLocation();
  // Si la selección vino de un clic en el mapa, el usuario ya está mirando
  // ese punto: no hay que mover la cámara.
  const selectedFromMap = useRef(false);

  // Selección hecha desde la lista: encuadra la alarma.
  useEffect(() => {
    if (selectedFromMap.current) {
      selectedFromMap.current = false;
      return;
    }
    if (!map) return;

    const alarm = alarms.find(({ id }) => id === selectedId);
    const points = alarm ? getAlarmPoints(alarm) : [];
    if (points.length === 0) return;

    map.flyToBounds(boundsOf(points), { ...visibleArea, maxZoom: 16 });
  }, [map, selectedId]);

  // Clic en el fondo del mapa: deselecciona.
  useEffect(() => {
    if (!map) return;

    const clearSelection = () => setSelectedId(null);
    map.on("click", clearSelection);
    return () => {
      map.off("click", clearSelection);
    };
  }, [map, setSelectedId]);

  const isSelected = (alarmId: string) => selectedId === alarmId;
  const isDimmed = (alarmId: string) =>
    selectedId !== null && selectedId !== alarmId;

  const centerOnUser = () => {
    if (map && userLocation.status === "granted") {
      map.flyTo(userLocation.position, 16);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <MapContainer
        ref={setMap}
        bounds={initialBounds}
        boundsOptions={visibleArea}
        zoomControl={false}
        className="flex-1"
      >
        <ZoomControl position="topright" />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Radios primero, para que los puntos queden encima. */}
        {alarmPoints.map(({ key, alarm, position }) => (
          <Circle
            key={`${key}-radius`}
            center={position}
            radius={alarm.radius}
            interactive={false}
            pathOptions={{
              color: alarm.color,
              weight: isSelected(alarm.id) ? 2 : 1,
              opacity: isDimmed(alarm.id) ? 0.2 : 0.8,
              fillOpacity: isDimmed(alarm.id)
                ? 0.05
                : isSelected(alarm.id)
                  ? 0.3
                  : 0.15,
            }}
          />
        ))}

        {alarmPoints.map(({ key, alarm, position, label }) => (
          <CircleMarker
            key={key}
            center={position}
            radius={isSelected(alarm.id) ? 10 : 8}
            // Que el clic no llegue al mapa, que deseleccionaría.
            bubblingMouseEvents={false}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: alarm.color,
              fillOpacity: isDimmed(alarm.id) ? 0.35 : 1,
              opacity: isDimmed(alarm.id) ? 0.35 : 1,
            }}
            eventHandlers={{
              click: () => {
                // Reseleccionar la misma no cambia el estado ni corre el
                // efecto, y dejaría la bandera encendida.
                if (alarm.id === selectedId) return;
                selectedFromMap.current = true;
                setSelectedId(alarm.id);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {label}
            </Tooltip>
          </CircleMarker>
        ))}

        {userLocation.status === "granted" && (
          <>
            <Circle
              center={userLocation.position}
              radius={userLocation.accuracy}
              interactive={false}
              pathOptions={{ color: USER_COLOR, weight: 0, fillOpacity: 0.12 }}
            />
            <CircleMarker
              center={userLocation.position}
              radius={8}
              interactive={false}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: USER_COLOR,
                fillOpacity: 1,
              }}
            />
          </>
        )}
      </MapContainer>

      {userLocation.status !== "granted" && (
        <p className="absolute top-4 left-1/2 z-1000 -translate-x-1/2 rounded-full bg-surface-50 px-4 py-2 text-sm text-dark-800 shadow-md">
          {locationMessages[userLocation.status]}
        </p>
      )}

      <button
        type="button"
        onClick={centerOnUser}
        disabled={userLocation.status !== "granted"}
        aria-label="Centrar en mi ubicación"
        title="Centrar en mi ubicación"
        className="absolute right-4 bottom-8 z-1000 flex size-12 items-center justify-center rounded-full bg-surface-50 text-cobalt-600 shadow-md transition-colors cursor-pointer hover:bg-surface-200 disabled:cursor-not-allowed disabled:text-dark-500"
      >
        <LocateFixed />
      </button>
    </div>
  );
}
