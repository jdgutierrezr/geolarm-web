import Link from "next/link";
import Image from "next/image";
import { SquareArrowRightExit } from "lucide-react";
import DownloadAppButton from "@/components/DownloadAppButton";

export default function NavBar() {
  return (
    <div className="relative isolate flex items-center justify-between overflow-hidden bg-linear-to-r from-cobalt-900 to-cobalt-600 p-4 text-dark-50 shadow-lg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[520px] opacity-30"
      >
        <Image
          src="/textures/clouds-texture.png"
          alt=""
          width={520}
          height={520}
          className="absolute left-0 top-0 max-w-none w-[520px]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[460px] w-[548px] opacity-30"
      >
        <Image
          src="/textures/clouds-texture.png"
          alt=""
          width={548}
          height={548}
          className="absolute left-0 top-0 max-w-none w-[548px] -scale-y-100 rotate-180"
        />
      </div>

      <div className="relative z-10 flex w-full items-center justify-between">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          className="h-12 w-auto"
        />

        <div className="flex items-center gap-8">
          <DownloadAppButton />
          <Link
            href="/auth/login"
            className="flex items-center gap-2  bg-amber-600 text-base font-normal px-8 py-2 rounded-lg cursor-pointer hover:bg-amber-500 active:bg-amber-700 active:scale-[0.98] active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)] transition-all duration-150"
          >
            Salir <SquareArrowRightExit size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
