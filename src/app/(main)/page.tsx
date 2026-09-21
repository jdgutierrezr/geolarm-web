"use client";

import { useCallback, useState } from "react";
import AlarmDetailCard from "@/components/AlarmDetailCard";
import AlarmMap from "@/components/AlarmMap";
import AlarmsList from "@/components/AlarmsList";
import { alarms } from "@/data/alarms";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAlarm = alarms.find(({ id }) => id === selectedId);

  const clearSelection = useCallback(() => setSelectedId(null), []);

  return (
    <div className="relative flex flex-col flex-1">
      <AlarmMap selectedId={selectedId} setSelectedId={setSelectedId} />
      <AlarmsList selectedId={selectedId} setSelectedId={setSelectedId} />
      {selectedAlarm && (
        <AlarmDetailCard alarm={selectedAlarm} onClose={clearSelection} />
      )}
    </div>
  );
}
