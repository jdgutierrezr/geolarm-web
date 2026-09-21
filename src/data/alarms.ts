import type { LatLng } from "@/lib/geo";

export type PlaceCategory = "supermarket" | "gym";

export type AlarmLocation =
  /** Una dirección concreta: un solo punto en el mapa. */
  | { type: "exact"; address: string; position: LatLng }
  /** Cualquier lugar de una categoría: tantos puntos como coincidencias. */
  | { type: "nearby"; category: PlaceCategory };

export type Alarm = {
  id: string;
  /** Nombre que el usuario le da a la alarma. */
  name: string;
  /** Color del pin y del círculo en el mapa, como hex. */
  color: string;
  /** Radio de activación en metros, alrededor de cada punto. */
  radius: number;
  location: AlarmLocation;
};

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  position: LatLng;
};

export const categoryLabels: Record<PlaceCategory, string> = {
  supermarket: "Supermercados cercanos",
  gym: "Gimnasios cercanos",
};

// Coordenadas aproximadas, solo para el prototipo.
export const alarms: Alarm[] = [
  {
    id: "1",
    name: "Entregar tesis",
    color: "#0d9488",
    radius: 300,
    location: {
      type: "exact",
      address: "Cra. 1 #18a-12, Bogotá",
      position: { lat: 4.6015, lng: -74.0661 },
    },
  },
  {
    id: "2",
    name: "Sacar al perro",
    color: "#7f1d1d",
    radius: 150,
    location: {
      type: "exact",
      address: "Calle 152 #46, Bogotá",
      position: { lat: 4.7382, lng: -74.06 },
    },
  },
  {
    id: "3",
    name: "Hablar con el jefe",
    color: "#16a34a",
    radius: 200,
    location: {
      type: "exact",
      address: "Cra. 7 #71-21, Bogotá",
      position: { lat: 4.6557, lng: -74.0565 },
    },
  },
  {
    id: "4",
    name: "Comprar leche",
    color: "#eab308",
    radius: 100,
    location: { type: "nearby", category: "supermarket" },
  },
  {
    id: "5",
    name: "Entrenar",
    color: "#9333ea",
    radius: 80,
    location: { type: "nearby", category: "gym" },
  },
];

// En producción esto sale de una búsqueda de lugares alrededor del usuario;
// aquí es una lista fija para poder dibujar las alarmas por categoría.
export const places: Place[] = [
  {
    id: "p1",
    name: "Carulla Calle 85",
    category: "supermarket",
    position: { lat: 4.669, lng: -74.054 },
  },
  {
    id: "p2",
    name: "Olímpica Calle 72",
    category: "supermarket",
    position: { lat: 4.657, lng: -74.059 },
  },
  {
    id: "p3",
    name: "Éxito Chapinero",
    category: "supermarket",
    position: { lat: 4.648, lng: -74.063 },
  },
  {
    id: "p4",
    name: "Bodytech Calle 85",
    category: "gym",
    position: { lat: 4.67, lng: -74.052 },
  },
  {
    id: "p5",
    name: "Smart Fit Calle 72",
    category: "gym",
    position: { lat: 4.658, lng: -74.061 },
  },
];

export type AlarmPoint = {
  key: string;
  alarm: Alarm;
  position: LatLng;
  /** Qué es este punto: la dirección, o el nombre del lugar que coincidió. */
  label: string;
};

/** Aplana una alarma a los puntos que se dibujan en el mapa. */
export function getAlarmPoints(alarm: Alarm): AlarmPoint[] {
  const { location } = alarm;

  if (location.type === "exact") {
    return [
      {
        key: alarm.id,
        alarm,
        position: location.position,
        label: location.address,
      },
    ];
  }

  return places
    .filter((place) => place.category === location.category)
    .map((place) => ({
      key: `${alarm.id}-${place.id}`,
      alarm,
      position: place.position,
      label: place.name,
    }));
}
