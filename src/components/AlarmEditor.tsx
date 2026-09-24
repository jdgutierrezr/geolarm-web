"use client";

import Link from "next/link";
import { ArrowLeft, Info, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState, type SubmitEvent } from "react";
import AlarmMap from "@/components/AlarmMap";
import NavBar from "@/components/NavBar";
import { alarms as defaultAlarms, getAlarmPoints } from "@/data/alarms";
import { getStoredAlarms, saveAlarms, useAlarms } from "@/lib/alarmStorage";
import type { LatLng } from "@/lib/geo";

const days = ["L", "M", "I", "J", "V", "S", "D"];
const colors = ["#2563eb", "#ff6b4a", "#16a34a", "#eab308", "#9333ea"];

type AlarmEditorProps = Readonly<{ mode: "create" | "edit"; alarmId?: string }>;

export default function AlarmEditor(props: AlarmEditorProps) {
  const { mode, alarmId } = props;
  const router = useRouter();
  const alarms = useAlarms();
  const existingAlarm = alarms.find(({ id }) => id === alarmId) ?? alarms[0] ?? defaultAlarms[0];
  const [name, setName] = useState(mode === "edit" ? existingAlarm.name : "");
  const initialPoint =
    existingAlarm.location.type === "exact"
      ? existingAlarm.location.position
      : getAlarmPoints(existingAlarm)[0]?.position ?? { lat: 4.65, lng: -74.06 };
  const [radius, setRadius] = useState(mode === "edit" ? existingAlarm.radius : 100);
  const [color, setColor] = useState(existingAlarm.color);
  const [address, setAddress] = useState(
    mode === "edit" && existingAlarm.location.type === "exact"
      ? existingAlarm.location.address
      : "",
  );
  const [position, setPosition] = useState<LatLng | null>(
    mode === "edit" ? initialPoint : null,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    mode === "edit" ? existingAlarm.repeatDays ?? ["L", "I", "J"] : [],
  );

  useEffect(() => {
    if (mode !== "edit") return;

    startTransition(() => {
      setName(existingAlarm.name);
      setRadius(existingAlarm.radius);
      setColor(existingAlarm.color);
      setSelectedDays(existingAlarm.repeatDays ?? ["L", "I", "J"]);
      setPosition(
        existingAlarm.location.type === "exact"
          ? existingAlarm.location.position
          : getAlarmPoints(existingAlarm)[0]?.position ?? {
              lat: 4.65,
              lng: -74.06,
            },
      );
      setAddress(
        existingAlarm.location.type === "exact"
          ? existingAlarm.location.address
          : "",
      );
    });
  }, [existingAlarm, mode]);

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((selected) => selected !== day)
        : [...current, day],
    );
  };

  const searchAddress = async () => {
    const query = address.trim();
    if (!query) return;

    setIsSearching(true);
    setLocationError("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
        { headers: { Accept: "application/json" } },
      );
      if (!response.ok) throw new Error("Geocoding failed");
      const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      const result = results[0];
      if (!result) {
        setLocationError("No encontramos esa dirección. Prueba con ciudad y país.");
        return;
      }
      setPosition({ lat: Number(result.lat), lng: Number(result.lon) });
      setAddress(result.display_name);
    } catch {
      setLocationError("No pudimos buscar la dirección. También puedes marcarla en el mapa.");
    } finally {
      setIsSearching(false);
    }
  };

  const save = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextAlarm = {
      id: mode === "edit" ? existingAlarm.id : crypto.randomUUID(),
      name: name.trim(),
      color,
      radius,
      repeatDays: selectedDays,
      location: {
        type: "exact" as const,
        address: address.trim(),
        position: position ?? initialPoint,
      },
    };
    const storedAlarms = getStoredAlarms();
    const nextAlarms =
      mode === "edit"
        ? storedAlarms.map((alarm) =>
            alarm.id === nextAlarm.id ? nextAlarm : alarm,
          )
        : [...storedAlarms, nextAlarm];
    saveAlarms(nextAlarms);
    router.push("/");
  };

  return (
    <>
      <NavBar />
      <main className="flex min-h-0 flex-1 flex-col bg-surface-50 text-dark-900">
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-4 sm:p-8 lg:flex-row lg:gap-10 lg:p-12 xl:p-20">
          <form
            onSubmit={save}
            className="flex w-full shrink-0 flex-col justify-center gap-5 lg:w-[min(52%,620px)] lg:p-5"
          >
          <Link
            href="/"
            className="flex w-fit items-center gap-3 px-1 text-xl font-medium text-coral-500 transition-colors hover:text-coral-600"
          >
            <ArrowLeft size={18} />
            Volver
          </Link>

          <div className="flex flex-col gap-5 rounded-xl p-3">
            <h1 className="text-3xl font-bold text-cobalt-500 sm:text-4xl">
              {mode === "create" ? "Crear alarma" : "Editar alarma"}
            </h1>

            <div className="flex items-end gap-3">
              <label className="flex min-w-0 flex-1 flex-col gap-1 text-xl font-medium">
                <span>Nombre</span>
                <span className="mt-1 flex items-center gap-3 rounded border border-marine-300 px-5 py-4 focus-within:border-cobalt-500 focus-within:ring-2 focus-within:ring-cobalt-500/20">
                  <Search size={18} className="shrink-0 text-marine-400" />
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Escribe el nombre de la alarma"
                    className="min-w-0 flex-1 bg-transparent text-base font-normal outline-none placeholder:text-marine-300"
                  />
                </span>
              </label>
              <div className="flex shrink-0 gap-2 pb-1">
                {colors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={`Color ${option}`}
                    aria-pressed={color === option}
                    onClick={() => setColor(option)}
                    className={`size-6 rounded-full border-2 transition-transform ${color === option ? "scale-125 border-dark-900" : "border-transparent"}`}
                    style={{ backgroundColor: option }}
                  />
                ))}
              </div>
            </div>

            <fieldset className="flex flex-col gap-1 border-0 p-0">
              <legend className="text-xl font-medium">Ubicación</legend>
              <div className="flex items-center gap-3 rounded border border-marine-300 px-4 py-3 focus-within:border-cobalt-500 focus-within:ring-2 focus-within:ring-cobalt-500/20">
                <MapPin size={18} className="shrink-0 text-coral-500" />
                <input
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void searchAddress();
                    }
                  }}
                  placeholder="Escribe una dirección"
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-marine-300"
                />
                <button
                  type="button"
                  onClick={() => void searchAddress()}
                  disabled={isSearching || !address.trim()}
                  aria-label="Buscar dirección"
                  title="Buscar dirección"
                  className="shrink-0 text-cobalt-600 transition-colors hover:text-cobalt-500 disabled:cursor-not-allowed disabled:text-marine-300"
                >
                  <Search size={20} />
                </button>
              </div>
              <p className="text-xs text-dark-600">También puedes hacer clic en el mapa para fijar el punto.</p>
              {locationError && <p className="text-xs text-red-600">{locationError}</p>}
            </fieldset>

            <fieldset className="flex flex-col gap-2 border-0 p-0">
              <legend className="text-xl font-medium">Radio</legend>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={radius}
                onChange={(event) => setRadius(Number(event.target.value))}
                className="h-5 w-full accent-coral-500"
              />
              <div className="flex justify-between text-xs">
                <span>10 metros</span>
                <strong className="text-coral-500">{radius} metros</strong>
                <span>500 metros</span>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="text-xl font-medium">Repetición</legend>
              <div className="flex justify-between gap-2 px-3 py-1">
                {days.map((day) => {
                  const selected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleDay(day)}
                      className={`flex size-11 items-center justify-center rounded-full border border-marine-900 text-2xl font-semibold transition-colors ${selected ? "border-coral-500 bg-coral-500 text-dark-50 shadow-[inset_4px_4px_4px_rgb(0_0_0/0.2)]" : "bg-transparent"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="flex items-center gap-2 px-3 text-xs text-purple-600">
                <Info size={16} />
                La letra &quot;I&quot; corresponde al miércoles.
              </p>
            </fieldset>
          </div>

          <div className="flex gap-5 p-3">
            {mode === "edit" && (
              <Link
                href="/"
                className="flex h-14 flex-1 items-center justify-center rounded-lg bg-marine-500 px-5 text-xl font-medium text-dark-50 shadow-[4px_4px_4px_rgb(0_0_0/0.25)] transition-colors hover:bg-marine-400"
              >
                Cancelar
              </Link>
            )}
            <button
              type="submit"
              className="flex h-14 flex-1 items-center justify-center rounded-lg bg-cobalt-600 px-5 text-xl font-medium text-dark-50 shadow-[4px_4px_4px_rgb(0_0_0/0.25)] transition-colors hover:bg-cobalt-500"
            >
              {mode === "create" ? "Guardar alarma" : "Guardar cambios"}
            </button>
          </div>
          </form>

          <div className="relative flex min-h-[420px] min-w-0 flex-1 overflow-hidden rounded-xl bg-surface-300">
            <AlarmMap
              alarms={alarms}
              selectedId={mode === "edit" ? existingAlarm.id : null}
              setSelectedId={() => undefined}
              previewPosition={position}
              previewRadius={radius}
              previewColor={color}
              onMapClick={(nextPosition) => {
                setPosition(nextPosition);
                setLocationError("");
                setAddress(`Punto seleccionado (${nextPosition.lat.toFixed(5)}, ${nextPosition.lng.toFixed(5)})`);
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}