"use client";

import { useCallback, useState } from "react";
import AlarmDetailCard from "@/components/AlarmDetailCard";
import AlarmMap from "@/components/AlarmMap";
import AlarmsList from "@/components/AlarmsList";
import DeleteAlarmDialog from "@/components/DeleteAlarmDialog";
import { getStoredAlarms, saveAlarms, useAlarms } from "@/lib/alarmStorage";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const alarms = useAlarms();
  const selectedAlarm = alarms.find(({ id }) => id === selectedId);

  const clearSelection = useCallback(() => setSelectedId(null), []);

  const deleteSelectedAlarm = () => {
    saveAlarms(getStoredAlarms().filter(({ id }) => id !== selectedId));
    setIsDeleting(false);
    setSelectedId(null);
  };

  return (
    <div className="relative flex flex-col flex-1">
      <AlarmMap alarms={alarms} selectedId={selectedId} setSelectedId={setSelectedId} />
      <AlarmsList alarms={alarms} selectedId={selectedId} setSelectedId={setSelectedId} />
      {selectedAlarm && (
        <AlarmDetailCard
          alarm={selectedAlarm}
          onClose={clearSelection}
          onDelete={() => setIsDeleting(true)}
        />
      )}
      {isDeleting && selectedAlarm && (
        <DeleteAlarmDialog
          onCancel={() => setIsDeleting(false)}
          onConfirm={deleteSelectedAlarm}
        />
      )}
    </div>
  );
}
