"use client";

import { useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { categoryLabels, getAlarmPoints, type Alarm } from "@/data/alarms";

type AlarmDetailCardProps = {
  alarm: Alarm;
  onClose: () => void;
};

export default function AlarmDetailCard({
  alarm,
  onClose,
}: AlarmDetailCardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const locationText =
    alarm.location.type === "exact"
      ? alarm.location.address
      : `${categoryLabels[alarm.location.category]} · ${getAlarmPoints(alarm).length} coincidencias`;

  return (
    <section
      aria-label={`Alarma ${alarm.name}`}
      className="absolute top-4 right-16 z-1000 flex w-120 flex-col gap-6 rounded-xl border border-white/50 bg-linear-to-br from-white/45 to-white/10 p-4 text-dark-black shadow-[0_8px_32px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.6)] ring-1 ring-black/5 backdrop-blur-md backdrop-saturate-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-xl font-semibold">{alarm.name}</h2>
          <p className="text-sm">{locationText}</p>
          <div className="my-2">
            <p className="text-xs font-medium">
              Radio de {alarm.radius} metros
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="shrink-0 cursor-pointer transition-colors hover:text-dark-600"
        >
          <X size={28} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-cobalt-600 py-2 text-dark-50 shadow-md cursor-pointer transition-all duration-150 hover:bg-cobalt-500 active:scale-[0.98] active:bg-cobalt-700 active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)]"
        >
          <Pencil size={18} />
          Editar
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-800 py-2 text-dark-50 shadow-md cursor-pointer transition-all duration-150 hover:bg-red-700 active:scale-[0.98] active:bg-red-900 active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)]"
        >
          <Trash2 size={18} />
          Eliminar
        </button>
      </div>
    </section>
  );
}
