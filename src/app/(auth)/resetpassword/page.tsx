"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { handleResetPassword } from "./resetPasswordAction";

// Initial state for the form action
const initialState = { success: false, message: "", error: null };

const ResetPassword = () => {
  // Manage state for form submission, loading, and alert messages
  const [state, formAction, isPending] = useActionState(
    handleResetPassword,
    initialState
  );
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<{ msg: string | null; error: boolean }>({
    msg: null,
    error: false,
  });

  // Handle form submission response and set alert messages accordingly
  useEffect(() => {
    if (state?.error) {
      setAlert({ msg: state.error, error: true });
    } else if (state?.success && state?.message) {
      setAlert({ msg: state.message, error: false });
      setTimeout(() => {
        setEmail("");
      }, 2000);
    }
  }, [state?.error, state?.message]);

  const { msg } = alert;
  return (
    <>
      {msg && <Alert alert={alert} />}
      <form action={formAction} className="w-full">
        <div className="flex flex-col mt-5">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-2">
          <Button text={"Send Email"} setButtonClicked={isPending} />
        </div>
        <Link
          href="/"
          className="text-gray-200 block text-cente hover:scale-105 transition-all ease-in-out duration-200"
        >
          Do you have an account already? {""}
          <span className="text-amber-500 font-extrabold ">Login </span>
        </Link>
      </form>
    </>
  );
};

export default ResetPassword;
