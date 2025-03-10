'use client'

import { useState } from "react"
import Button from "@/components/Button"
import Link from "next/link"
import useAuth from "@/hooks/UseAuth"
import Alert from "@/components/Alert"


const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const [buttonClicked, setButtonClicked] = useState(false)
    const { sendEmailResetPassword } = useAuth()
    const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: '', error: false })


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            return setAlert({
                msg: 'The field is mandatory',
                error: true
            })
        }

        setButtonClicked(true)

        // Attempt to send password reset email
        const sendEmailError = await sendEmailResetPassword({ email })
        if (sendEmailError) {
            setAlert({
                msg: sendEmailError || 'Hubo un error',
                error: true
            })
        } else {
            setAlert({
                msg: 'Email send it correctly, please check your imbox',
                error: false
            })
            
            // Reset email and alert after 2 seconds
            setTimeout(() => {
                setAlert({ msg: '', error: false })
                setEmail('')
            }, 2000);
        }

        // Ensure button state resets even if an error occurs
        setButtonClicked(false)
    }

    const { msg } = alert


    return (
        <>
            <form className="w-full" onSubmit={handleSubmit}>
                {msg && <Alert alert={alert} />}
                <div className="flex flex-col mt-5">
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
                <div className="mt-2">
                    <Button text={"Send Email"} setButtonClicked={buttonClicked} />
                </div>
                <Link href="/" className="text-gray-200 block text-cente hover:scale-105 transition-all ease-in-out duration-200">
                    Do you have an account already? {""}
                    <span className="text-amber-500 font-extrabold ">Login </span></Link>
            </form>
        </>
    )
}

export default ResetPassword