"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { alarms as defaultAlarms, categoryLabels } from "@/data/alarms";
import AlarmMap from "@/components/AlarmMap";
import { getStoredAlarms, saveAlarms, useAlarms } from "@/lib/alarmStorage";

function DeleteAlarmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alarms = useAlarms();
  const alarm = alarms.find(({ id }) => id === searchParams.get("id")) ?? alarms[0] ?? defaultAlarms[0];
  const location = alarm.location.type === "exact" ? alarm.location.address : categoryLabels[alarm.location.category];

  return (
    <main className="relative flex min-h-0 flex-1 overflow-hidden bg-surface-200 text-dark-900">
      <AlarmMap alarms={alarms} selectedId={alarm.id} setSelectedId={() => undefined} />
      <section className="absolute left-1/2 top-1/2 z-1000 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-50 p-6 shadow-2xl sm:p-8">
        <Link href="/" className="mb-8 flex w-fit items-center gap-3 text-xl font-medium text-coral-500 hover:text-coral-600">
          <ArrowLeft size={18} />
          Volver
        </Link>
        <div className="mb-8 flex items-start gap-4">
          <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full text-dark-50" style={{ backgroundColor: alarm.color }}>
            <MapPin size={24} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold text-marine-900">Eliminar alarma</h1>
            <p className="mt-2 text-base text-dark-700">¿Quieres eliminar &quot;{alarm.name}&quot;?</p>
            <p className="text-sm text-dark-600">{location} · Radio de {alarm.radius} metros</p>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Link href="/" className="flex h-14 flex-1 items-center justify-center rounded-lg bg-marine-500 text-xl font-medium text-dark-50 shadow-[4px_4px_4px_rgb(0_0_0/0.25)] hover:bg-marine-400">
            Cancelar
          </Link>
          <button type="button" onClick={() => {
            saveAlarms(getStoredAlarms().filter(({ id }) => id !== alarm.id));
            router.push("/");
          }} className="flex h-14 flex-1 items-center justify-center gap-3 rounded-lg bg-red-800 text-xl font-medium text-dark-50 shadow-[4px_4px_4px_rgb(0_0_0/0.25)] hover:bg-red-700">
            <Trash2 size={20} />
            Eliminar
          </button>
        </div>
      </section>
    </main>
  );
}

export default function DeleteAlarmPage() {
  return (
    <Suspense>
      <DeleteAlarmContent />
    </Suspense>
  );
}