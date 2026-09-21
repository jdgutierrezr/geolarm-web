import Link from "next/link";
import Image from "next/image";
import { SquareArrowRightExit } from "lucide-react";
import DownloadAppButton from "@/components/DownloadAppButton";

export default function NavBar() {
  return (
    <div className="flex items-center justify-between p-4 text-dark-50">
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
  );
}
