import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-1">
      <div className="relative flex w-1/2 items-end overflow-hidden bg-linear-to-b from-cobalt-900 from-5% via-cobalt-500 via-75% to-cobalt-400 to-100%">
        <div
          aria-hidden
          className="opacity-80 pointer-events-none absolute inset-0 bg-[url('/textures/clouds-texture.png')] bg-cover bg-center"
        />

        <h1 className="relative z-10 text-4xl font-bold mx-8 my-20">
          Alarma que avisa cuando llegas, no cuando despiertas.
        </h1>
      </div>

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
              Iniciar sesión
            </h1>
            <h3 className="text-base font-normal text-cobalt-900">
              Ingresa las credenciales de tu cuenta para continuar
            </h3>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
