"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AlarmEditor from "@/components/AlarmEditor";

function EditAlarmContent() {
  const searchParams = useSearchParams();
  return <AlarmEditor mode="edit" alarmId={searchParams.get("id") ?? "1"} />;
}

export default function EditAlarmPage() {
  return (
    <Suspense>
      <EditAlarmContent />
    </Suspense>
  );
}