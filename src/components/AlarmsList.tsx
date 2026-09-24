"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Search, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { categoryLabels, type Alarm } from "@/data/alarms";

/** Ancho en px. El mapa lo usa para no dejar puntos escondidos debajo. */
export const ALARMS_LIST_WIDTH = 384;

/** Minúsculas y sin tildes, para que "papas" encuentre "papás". */
const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type AlarmsListProps = Readonly<{
  alarms: Alarm[];
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}>;

export default function AlarmsList(props: AlarmsListProps) {
  const { alarms, selectedId, setSelectedId } = props;
  const [query, setQuery] = useState("");
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  const normalizedQuery = normalize(query.trim());
  const filteredAlarms = alarms.filter((alarm) =>
    normalize(alarm.name).includes(normalizedQuery),
  );

  // Si la selección llega desde el mapa, trae la tarjeta a la vista.
  useEffect(() => {
    if (selectedId) {
      itemRefs.current
        .get(selectedId)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedId]);

  return (
    <aside
      style={{ width: ALARMS_LIST_WIDTH }}
      className="absolute inset-y-0 left-0 z-1000 flex flex-col bg-surface-50 text-dark-900 shadow-[6px_0_16px_-4px_rgb(0_0_0/0.25)] p-6"
    >
      <div className="pb-8">
        <h1 className="text-2xl font-bold text-marine-900 mb-4">Mis Alarmas</h1>
        <div className="flex items-center gap-2 rounded-full bg-marine-100 p-2 transition-colors focus-within:border-coral-500 focus-within:ring-2 focus-within:ring-coral-500/20 text-dark-black">
          <Search size={24} className="ms-2" />
          <input
            id="alarm-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar alarma por nombre"
            autoComplete="off"
            className="w-full bg-transparent text-sm outline-none p-2"
          />
        </div>
      </div>
      {filteredAlarms.length === 0 ? (
        <div className="flex flex-1">
          <p className="text-sm text-dark-600">
            Ninguna alarma coincide con «{query.trim()}».
          </p>
        </div>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-1">
          {filteredAlarms.map((alarm) => {
            const isSelected = alarm.id === selectedId;

            return (
              <li
                key={alarm.id}
                ref={(element) => {
                  if (!element) return;
                  itemRefs.current.set(alarm.id, element);
                  return () => {
                    itemRefs.current.delete(alarm.id);
                  };
                }}
              >
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedId((current) =>
                      current === alarm.id ? null : alarm.id,
                    )
                  }
                  className={`group flex w-full items-start gap-3 p-3 text-left transition-colors cursor-pointer shadow-md ${
                    isSelected
                      ? "bg-coral-500"
                      : "bg-surface-500 hover:bg-coral-50"
                  }`}
                >
                  <span
                    className="mt-1.5 size-8 shrink-0 rounded-full shadow-[inset_2px_2px_2px_0_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: alarm.color }}
                  />
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 flex-col">
                      <span
                        className={`font-semibold ${
                          isSelected ? "text-dark-50" : "text-dark-900"
                        }`}
                      >
                        {alarm.name}
                      </span>
                      <span
                        className={`block truncate text-sm ${
                          isSelected ? "text-dark-50/80" : "text-dark-800/80"
                        }`}
                      >
                        {alarm.location.type === "exact"
                          ? alarm.location.address
                          : categoryLabels[alarm.location.category]}
                      </span>
                    </div>
                    {!isSelected ? (
                      <ChevronRight
                        size={40}
                        strokeWidth={1}
                        className="ml-auto text-marine-300 transition-colors group-hover:text-coral-500"
                      />
                    ) : (
                      <ChevronRight
                        size={40}
                        strokeWidth={1}
                        className="ml-auto text-transparent"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/create-alarm" className="bg-cobalt-600 text-dark-50 flex gap-2 items-center justify-center py-2 rounded-md mt-8 cursor-pointer hover:bg-cobalt-500 active:bg-cobalt-700 active:scale-[0.98] active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)] transition-all duration-150">
        <Plus size={24} />
        Crear alarma
      </Link>
    </aside>
  );
}
