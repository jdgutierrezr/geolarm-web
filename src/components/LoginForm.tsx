"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, CircleAlert } from "lucide-react";
import { useState, ChangeEvent, FocusEvent, FormEvent } from "react";

const fieldBox = (hasError: boolean) =>
  `flex items-center justify-between w-full rounded-md border p-2 transition-colors focus-within:ring-2 ${
    hasError
      ? "border-red-600 focus-within:border-red-600 focus-within:ring-red-600/20"
      : "border-marine-300 focus-within:border-coral-500 focus-within:ring-coral-500/20"
  }`;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const showEmailError = touched.email && !isEmailValid;
  const showPasswordError = touched.password && !isPasswordValid;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = event.target;

    if (name in touched) {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
    }
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setTouched({ email: true, password: true });
      return;
    }

    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 w-full"
    >
      <div className="flex flex-col gap-2 group">
        <label
          className="text-xl font-medium text-dark-black transition-colors group-focus-within:text-coral-500"
          htmlFor="email"
        >
          Email
        </label>
        <div className={fieldBox(showEmailError)}>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? "email-error" : undefined}
            className="w-full border-0 bg-transparent text-dark-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm p-2"
            placeholder="Escribe tu email"
          />
        </div>
        {showEmailError && (
          <div
            id="email-error"
            className="text-red-600 flex items-center gap-1"
          >
            <CircleAlert size={16} strokeWidth={1} />
            <p className="text-sm">El email no es válido.</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 group">
        <label
          className="text-xl font-medium text-dark-black transition-colors group-focus-within:text-coral-500"
          htmlFor="password"
        >
          Contraseña
        </label>
        <div className={fieldBox(showPasswordError)}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showPasswordError}
            aria-describedby={showPasswordError ? "password-error" : undefined}
            className="w-full border-0 bg-transparent text-dark-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm [&::-ms-reveal]:hidden p-2"
            placeholder="Escribe tu contraseña"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="ml-2 focus:outline-none cursor-pointer text-marine-300"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
        {showPasswordError && (
          <div
            id="password-error"
            className="text-red-600 flex items-center gap-1"
          >
            <CircleAlert size={16} strokeWidth={1} />
            <p className="text-sm">
              La contraseña debe contener al menos 6 caracteres.
            </p>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="mt-6 bg-cobalt-600 hover:bg-cobalt-500 text-dark-50 text-xl font-medium py-2 px-4 rounded-md w-full active:bg-cobalt-700 active:scale-[0.98] active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)] transition-all duration-150 cursor-pointer"
      >
        Iniciar sesión
      </button>
      <div className="flex w-full items-center justify-between">
        <Link
          href="/auth/signup"
          className="text-base font-normal text-coral-500 hover:text-coral-700 transition-colors"
        >
          ¿No tienes cuenta?
        </Link>
        <Link
          href="/auth/signup"
          className="text-base font-normal text-coral-500 hover:text-coral-700 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  );
}
