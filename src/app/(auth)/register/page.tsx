"use client";

import Link from "next/link"
import Alert from "@/components/Alert";
import Button from "@/components/Button"
import { useState, useActionState, useEffect } from "react"
import { handleRegister } from "./registerFormAction";
import { useRouter } from "next/navigation";

// Initial state for the form and API response
const initialState = { success: false, message: "", error: null }

export default function Register() {
  const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: null, error: false })
  // Manage form state and API action response using `useActionState`
  const [state, formAction, isPending] = useActionState(handleRegister, initialState)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", repeatPassword: "" });
  const router = useRouter()

  // Effect to handle response from the registration request
  useEffect(() => {
    if (state?.error) {
      setAlert({ msg: state.error, error: true })
    }
    else if (state?.success && state?.message) {
      setAlert({ msg: state.message, error: false })
      // Redirect to login page after successful registration with a delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [state]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { msg } = alert
  return (
    <>
      {msg && <Alert alert={alert} />}
      <form action={formAction} className="w-full">
        <div>
          <label htmlFor="name"
            className="font-bold text-white text-xl block">
            Name
          </label>
          <input id="name" type="name"
            name="name"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="Your Name" autoComplete="username"
            value={formData.name}
            onChange={handleChange}
            required />
        </div>
        <div className="mt-4">
          <label htmlFor="email"
            className="font-bold text-white text-xl block">
            Email
          </label>
          <input id="email" type="email" name="email"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="Email" autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            required />
        </div>

        <div className="mt-4">
          <label htmlFor="password"
            className="font-bold text-white text-xl block">
            Password
          </label>
          <input id="password" type="password" name="password"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="Password" autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required />
        </div>

        <div className="mt-4">
          <label htmlFor="repeat-password"
            className="font-bold text-white text-xl block">
            Repeat Password
          </label>
          <input id="repeat-password" type="password" name="repeatPassword"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="Repeat Password" autoComplete="current-password"
            value={formData.repeatPassword}
            onChange={handleChange}
            required />
        </div>
        <div className="mt-10">
          <Button text={'Register'} setButtonClicked={isPending} />
        </div>
        <nav className="mt-2 lg:flex lg:justify-between">
          <Link href="/" className="text-gray-200 block text-cente hover:scale-105 transition-all ease-in-out duration-200">
            Do you have an account already? {""}
            <span className="text-amber-500 font-extrabold ">Login </span></Link>
        </nav>
      </form>
    </>
  )
}

