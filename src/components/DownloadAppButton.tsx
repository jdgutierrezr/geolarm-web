"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Parámetro de URL que abre el modal al cargar, p. ej. `/?download=1`. */
export const DOWNLOAD_APP_PARAM = "download";

export default function DownloadAppButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    // showModal() lanza error si el diálogo ya está abierto.
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(DOWNLOAD_APP_PARAM)) return;

    open();

    // Limpia la URL para que recargar la página no vuelva a abrirlo.
    url.searchParams.delete(DOWNLOAD_APP_PARAM);
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="text-base font-normal cursor-pointer hover:underline"
      >
        Descargar app
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="download-app-title"
        // Un clic en la cortina llega al <dialog> mismo; uno en el
        // contenido llega a sus hijos.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto rounded-xl bg-surface-50 p-0 text-dark-900 shadow-2xl open:animate-pop-in backdrop:bg-marine-900/60 backdrop:backdrop-blur-sm open:backdrop:animate-curtain-in"
      >
        <div className="flex w-96 flex-col">
          <div className="flex w-full items-start justify-between gap-4 bg-cobalt-700 px-4 py-2">
            <h2
              id="download-app-title"
              className="text-2xl font-medium text-dark-50"
            >
              Aplicación disponible
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="cursor-pointer transition-colors text-dark-50 hover:text-dark-300"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col p-4 items-center gap-6">
            <p className="text-sm text-dark-700">
              Descarga nuestra aplicación en tu celular para que no te pierdas
              ninguna de tus alarmas.
            </p>

            <Image
              src="/images/qr.png"
              alt="Código QR para descargar la app de Geolarm"
              width={224}
              height={224}
              className="rounded-lg"
            />

            <button
              onClick={close}
              className="bg-cobalt-600 py-2 w-full text-dark-50 rounded-md cursor-pointer hover:bg-cobalt-500 active:bg-cobalt-700 active:scale-[0.98] active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)] transition-all duration-150"
            >
              ¡Ya la descargué!
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
