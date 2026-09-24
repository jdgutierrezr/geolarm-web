"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type DeleteAlarmDialogProps = Readonly<{
  onCancel: () => void;
  onConfirm: () => void;
}>;

export default function DeleteAlarmDialog(props: DeleteAlarmDialogProps) {
  const { onCancel, onConfirm } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // showModal() lanza error si el diálogo ya está abierto.
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-alarm-title"
      // Escape y clic en la cortina cuentan como cancelar.
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto w-[min(92vw,470px)] overflow-hidden rounded-md bg-surface-50 p-0 text-dark-900 shadow-2xl open:animate-pop-in backdrop:bg-marine-900/60 backdrop:backdrop-blur-sm open:backdrop:animate-curtain-in"
    >
      <div className="flex items-center justify-between gap-4 bg-cobalt-600 px-6 py-4 text-dark-50">
        <h2 id="delete-alarm-title" className="text-2xl font-bold">
          Eliminar alarma
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="shrink-0 cursor-pointer transition-opacity hover:opacity-80"
        >
          <X size={28} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-6 px-6 py-5">
        <p className="text-base">
          ¿Deseas eliminar esta alarma? Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex flex-1 items-center justify-center rounded-md bg-marine-500 px-5 py-3 text-xl font-medium text-dark-50 shadow-md cursor-pointer transition-all duration-150 hover:bg-marine-400 active:scale-[0.98] active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)]"
          >
            No, cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center rounded-md bg-red-800 px-5 py-3 text-xl font-medium text-dark-50 shadow-md cursor-pointer transition-all duration-150 hover:bg-red-700 active:scale-[0.98] active:bg-red-900 active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)]"
          >
            Si, eliminar
          </button>
        </div>
      </div>
    </dialog>
  );
}
