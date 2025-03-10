"use client";

import { useState } from "react";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import useAuth from "@/hooks/UseAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Home = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState<{ msg: string, error: boolean }>({ msg: '', error: false })
  const [buttonClicked, setButtonClicked] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errorMessage: string = '';
    if ([email, password].includes('')) errorMessage = 'All fields are mandatory'
    else if (!/\S+@\S+\.\S+/.test(email)) errorMessage = 'Please enter a valid email'

    if (errorMessage) {
      return setAlert({ msg: errorMessage, error: true });
    }

    setAlert({ msg: '', error: false });
    setButtonClicked(true)

    const loginError = await login(email, password)
    if (loginError) {
      setAlert({
        msg: loginError || 'Hubo un error',
        error: true
      })
    }
    else {
      router.push('/home');
    }
    setButtonClicked(false)
  }

  const { msg } = alert

  return (
    <>
      {msg && <Alert alert={alert} />}
      <form onSubmit={handleSubmit} className="w-full mt-5 ">
        <div>
          <label htmlFor="email"
            className="font-bold text-white text-xl block">
            E-mail
          </label>
          <input id="email" type="email"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="E-mail" autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mt-4">
          <label htmlFor="password"
            className="font-bold text-white text-xl block">
            Password
          </label>
          <input id="password" type="password"
            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
            placeholder="Password" autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={` items-center flex-col justify-center  mt-10`}>

        </div>
        <div className="mt-10">
          <Button text={"Login"} setButtonClicked={buttonClicked} />
        </div>

        <nav className="mt-2 lg:flex lg:justify-between">
          <Link href="/register" className="text-gray-200 block text-center hover:scale-105 transition-all ease-in-out duration-200">
            Don&apos;t have an account? {""}
            <span className="text-amber-500 font-extrabold ">Register </span></Link>
          <Link href="/resetpassword" className="text-gray-200 block text-center hover:scale-105 transition-all ease-in-out duration-200">
            Do you forgot your {""}
            <span className="text-amber-500 font-extrabold ">Password?</span></Link>

        </nav>
      </form>

    </>
  )
}

export default Home

