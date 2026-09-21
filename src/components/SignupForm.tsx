"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, CircleAlert } from "lucide-react";
import { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
import { DOWNLOAD_APP_PARAM } from "@/components/DownloadAppButton";

const fieldBox = (hasError: boolean) =>
  `flex items-center justify-between w-full rounded-md border p-2 transition-colors focus-within:ring-2 ${
    hasError
      ? "border-red-600 focus-within:border-red-600 focus-within:ring-red-600/20"
      : "border-marine-300 focus-within:border-coral-500 focus-within:ring-coral-500/20"
  }`;

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRewritePassword, setShowRewritePassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rewritePassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    rewritePassword: false,
  });

  const isNameValid = form.name.length >= 1;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const isRewritePasswordValid =
    form.rewritePassword.length > 0 && form.password === form.rewritePassword;
  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isRewritePasswordValid;

  const showNameError = touched.name && !isNameValid;
  const showEmailError = touched.email && !isEmailValid;
  const showPasswordError = touched.password && !isPasswordValid;
  const showRewritePasswordError =
    touched.rewritePassword && !isRewritePasswordValid;

  const togglePasswordVisibility = (rewritting: boolean) => {
    if (rewritting) {
      setShowRewritePassword(
        (prevShowRewritePassword) => !prevShowRewritePassword,
      );
    } else {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    }
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
      setTouched({
        name: true,
        email: true,
        password: true,
        rewritePassword: true,
      });
      return;
    }

    router.push(`/?${DOWNLOAD_APP_PARAM}=1`);
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
          htmlFor="name"
        >
          Nombre
        </label>
        <div className={fieldBox(showNameError)}>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border-0 bg-transparent text-dark-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm p-2"
            placeholder="Escribe tu nombre"
          />
        </div>
        {showNameError && (
          <div className="text-red-600 flex items-center gap-1">
            <CircleAlert size={16} strokeWidth={1} />
            <p className="text-sm">Escribe tu nombre completo.</p>
          </div>
        )}
      </div>
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
            className="w-full border-0 bg-transparent text-dark-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm p-2"
            placeholder="Escribe tu email"
          />
        </div>
        {showEmailError && (
          <div className="text-red-600 flex items-center gap-1">
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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border-0 bg-transparent text-dark-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm [&::-ms-reveal]:hidden p-2"
            placeholder="Escribe tu contraseña"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(false)}
            className="ml-2 focus:outline-none cursor-pointer text-marine-300"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
        {showPasswordError && (
          <div className="text-red-600 flex items-center gap-1">
            <CircleAlert size={16} strokeWidth={1} />
            <p className="text-sm">
              La contraseña debe contener al menos 6 caracteres.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 group">
        <label
          className="text-xl font-medium text-dark-black transition-colors group-focus-within:text-coral-500"
          htmlFor="rewrite-password"
        >
          Repetir Contraseña
        </label>
        <div className={fieldBox(showRewritePasswordError)}>
          <input
            type={showRewritePassword ? "text" : "password"}
            id="rewrite-password"
            name="rewritePassword"
            autoComplete="new-password"
            value={form.rewritePassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border-0 bg-transparent text-dark-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm [&::-ms-reveal]:hidden p-2"
            placeholder="Escribe nuevamente tu contraseña"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(true)}
            className="ml-2 focus:outline-none cursor-pointer text-marine-300"
          >
            {showRewritePassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
        {showRewritePasswordError && (
          <div className="text-red-600 flex items-center gap-1">
            <CircleAlert size={16} strokeWidth={1} />
            <p className="text-sm">Las contraseñas no coinciden.</p>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="mt-6 bg-cobalt-600 hover:bg-cobalt-500 text-dark-50 text-xl font-medium py-2 px-4 rounded-md w-full active:bg-cobalt-700 active:scale-[0.98] active:shadow-[inset_4px_4px_4px_0_rgba(0,0,0,0.5)] transition-all duration-150 cursor-pointer"
      >
        Crear cuenta
      </button>
      <div className="flex w-full justify-center">
        <Link
          href="/auth/login"
          className="text-base font-normal text-coral-500 hover:text-coral-700 transition-colors"
        >
          ¿Ya tienes cuenta?
        </Link>
      </div>
    </form>
  );
}
