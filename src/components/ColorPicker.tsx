"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export const ALARM_COLORS = [
  { value: "#2563eb", name: "Azul" },
  { value: "#ff6b4a", name: "Coral" },
  { value: "#16a34a", name: "Verde" },
  { value: "#eab308", name: "Amarillo" },
  { value: "#9333ea", name: "Morado" },
];

type ColorPickerProps = Readonly<{
  value: string;
  onChange: (color: string) => void;
}>;

export default function ColorPicker(props: ColorPickerProps) {
  const { value, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    ALARM_COLORS.find((color) => color.value === value) ?? ALARM_COLORS[0];

  // Cerrar al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-20 shrink-0">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`Color: ${selected.name}`}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded border border-marine-300 px-3 py-4 transition-colors hover:border-cobalt-500"
      >
        <span
          className="size-6 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: selected.value }}
        />
        <ChevronDown
          size={18}
          className={`shrink-0 text-marine-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 flex w-full flex-col overflow-hidden rounded border border-marine-300 bg-surface-50 shadow-lg">
          {ALARM_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              aria-label={color.name}
              aria-pressed={color.value === value}
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
              className="flex w-full cursor-pointer items-center justify-center px-3 py-3 transition-colors hover:bg-surface-200"
            >
              <span
                className={`size-6 shrink-0 rounded-full border ${color.value === value ? "ring-2 ring-dark-900 ring-offset-1" : "border-black/10"}`}
                style={{ backgroundColor: color.value }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
