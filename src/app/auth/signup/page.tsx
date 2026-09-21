import SignupForm from "@/components/SignupForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-1">
      <div className="flex w-1/2 flex-col bg-surface-100 p-12">
        <div className="flex justify-end">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold text-cobalt-500">
              Crea una cuenta
            </h1>
            <h3 className="text-base font-normal text-cobalt-900">
              Regístrate para comenzar a gestionar tus alarmas
            </h3>
          </div>

          <SignupForm />
        </div>
      </div>

      <div className="relative flex w-1/2 items-end overflow-hidden bg-linear-to-b from-cobalt-900 from-5% via-cobalt-500 via-75% to-cobalt-400 to-100%">
        <div
          aria-hidden
          className="opacity-80 pointer-events-none absolute inset-0 bg-[url('/textures/clouds-texture.png')] bg-cover bg-center"
        />

        <h1 className="relative z-10 text-4xl font-bold mx-8 my-12 text-end">
          Descansa en el trayecto, nosotros avisamos.
        </h1>
      </div>
    </div>
  );
}
