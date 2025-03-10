"use client";

import Link from "next/link"
import Alert from "@/components/Alert"
import Button from "@/components/Button"
import { useState } from "react"
import useAuth from "@/hooks/UseAuth";


export default function Register() {

  const [alert, setAlert] = useState<{ msg: string, error: boolean }>({ msg: '', error: false })
  const { msg } = alert

  return (
    <>
      {msg && <Alert alert={alert} />}
      <RegisterForm setAlert={setAlert} />
    </>
  )
}

interface RegisterFormProps {
  setAlert: React.Dispatch<React.SetStateAction<{ msg: string, error: boolean }>>;
}

const RegisterForm = ({ setAlert }: RegisterFormProps) => {

  const [formData, setFormData] = useState({ name: "", email: "", password: "", repeatPassword: "" });
  const [buttonClicked, setButtonClicked] = useState(false)
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, repeatPassword } = formData;

    // Validate Inputs
    let errorMessage = '';
    if (!name || !email || !password || !repeatPassword) errorMessage = "All fields are mandatory";
    else if (password !== repeatPassword) errorMessage = "The passwords are different";
    else if (password.length < 6) errorMessage = "The password is too short";

    if (errorMessage) {
      setAlert({ msg: errorMessage, error: true });
      return;
    }

    setAlert({ msg: '', error: false })
    setButtonClicked(true)

    const registerError = await register(name, email, password)
    if (registerError) {
      setAlert({
        msg: registerError || 'Hubo un error',
        error: true
      })
    }
    else {
      setAlert({
        msg: 'User created Successfully! Verify your email',
        error: false
      })
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "", repeatPassword: "" })
        setAlert({ msg: '', error: false })
      }, 2000);
    }
    setButtonClicked(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
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
            onChange={handleChange} />
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
            onChange={handleChange} />
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
            onChange={handleChange} />
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
            onChange={handleChange} />
        </div>
        <div className="mt-10">
          <Button text={'Register'} setButtonClicked={buttonClicked} />
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


