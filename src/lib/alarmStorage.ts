"use client";

import { useEffect, useState } from "react";
import { alarms as defaultAlarms, type Alarm } from "@/data/alarms";

const STORAGE_KEY = "geolarm:alarms";
const ALARMS_CHANGED_EVENT = "geolarm:alarms-changed";
let resetForCurrentPageLoad = false;

export function getStoredAlarms(): Alarm[] {
  if (typeof window === "undefined") return defaultAlarms;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultAlarms;
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as Alarm[]) : defaultAlarms;
  } catch {
    return defaultAlarms;
  }
}

export function saveAlarms(nextAlarms: Alarm[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAlarms));
  window.dispatchEvent(new Event(ALARMS_CHANGED_EVENT));
}

export function useAlarms() {
  const [currentAlarms, setCurrentAlarms] = useState<Alarm[]>(defaultAlarms);

  useEffect(() => {
    if (!resetForCurrentPageLoad) {
      window.localStorage.removeItem(STORAGE_KEY);
      resetForCurrentPageLoad = true;
    }

    const syncAlarms = () => setCurrentAlarms(getStoredAlarms());
    window.addEventListener(ALARMS_CHANGED_EVENT, syncAlarms);
    window.addEventListener("storage", syncAlarms);
    syncAlarms();

    return () => {
      window.removeEventListener(ALARMS_CHANGED_EVENT, syncAlarms);
      window.removeEventListener("storage", syncAlarms);
    };
  }, []);

  return currentAlarms;
}