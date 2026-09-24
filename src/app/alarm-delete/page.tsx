"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { alarms as defaultAlarms } from "@/data/alarms";
import AlarmMap from "@/components/AlarmMap";
import DeleteAlarmDialog from "@/components/DeleteAlarmDialog";
import { getStoredAlarms, saveAlarms, useAlarms } from "@/lib/alarmStorage";

function DeleteAlarmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alarms = useAlarms();
  const alarm =
    alarms.find(({ id }) => id === searchParams.get("id")) ??
    alarms[0] ??
    defaultAlarms[0];

  const deleteAlarm = () => {
    saveAlarms(getStoredAlarms().filter(({ id }) => id !== alarm.id));
    router.push("/");
  };

  return (
    <main className="relative flex min-h-0 flex-1 overflow-hidden bg-surface-200 text-dark-900">
      <AlarmMap
        alarms={alarms}
        selectedId={alarm.id}
        setSelectedId={() => undefined}
      />
      <DeleteAlarmDialog
        onCancel={() => router.push("/")}
        onConfirm={deleteAlarm}
      />
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
