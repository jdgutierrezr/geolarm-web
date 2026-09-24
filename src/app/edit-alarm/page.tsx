"use client";

import { useSearchParams } from "next/navigation";
import AlarmEditor from "@/components/AlarmEditor";

export default function EditAlarmPage() {
  const searchParams = useSearchParams();
  return <AlarmEditor mode="edit" alarmId={searchParams.get("id") ?? "1"} />;
}