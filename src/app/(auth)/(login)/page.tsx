"use client";

import { useActionState, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/UseAuth";
import Alert from "@/components/ui/Alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogin } from "./loginFormAction";

// Initial state for handling login state
const initialState = { success: false, user: null, error: null };

export default function Login() {
  const [alert, setAlert] = useState<{ msg: string | null; error: boolean }>({
    msg: null,
    error: false,
  });
  // State management hook to handle form submission and response from login action
  const [state, formAction, isPending] = useActionState(
    handleLogin,
    initialState
  );
  const { updateUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/worldmap/health`);
      } catch (error) {
        console.error("Waking up Server:", error);
      }
    };
    pingBackend();
  }, []);

  // Effect to handle user state after successful login or error handling
  useEffect(() => {
    if (state?.success && state?.user) {
      updateUser(state.user);
      router.push("/home");
    } else if (state?.error) {
      setAlert({ msg: state.error, error: true });
    }
  }, [state]);

  const { msg } = alert;
  return (
    <>
      {msg && <Alert alert={alert} />}
      <form action={formAction} className="w-full mt-5 ">
        <div>
          <label htmlFor="email" className="font-bold text-white text-xl block">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="E-mail"
            autoComplete="username"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="password"
            className="font-bold text-white text-xl block"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div className={` items-center flex-col justify-center  mt-10`}></div>
        <div className="mt-10">
          <Button text={"Login"} setButtonClicked={isPending} />
        </div>
        <nav className="mt-2 lg:flex lg:justify-between">
          <Link
            href="/register"
            className="text-gray-200 block text-center hover:scale-105 transition-all ease-in-out duration-200"
          >
            Don&apos;t have an account? {""}
            <span className="text-amber-500 font-extrabold ">Register </span>
          </Link>
          <Link
            href="/resetpassword"
            className="text-gray-200 block text-center hover:scale-105 transition-all ease-in-out duration-200"
          >
            Do you forgot your {""}
            <span className="text-amber-500 font-extrabold ">Password?</span>
          </Link>
        </nav>
      </form>
    </>
  );
}
