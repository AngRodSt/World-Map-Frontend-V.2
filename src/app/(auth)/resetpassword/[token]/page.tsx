'use client'

import { useState } from "react"
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import TokenVerifierPass from "./TokenVerifierPass";
import { useRouter } from "next/navigation";


const ConfirmNewPassword = () => {
    const params = useParams();
    const token = params?.token as string | undefined
    const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: '', error: false })
    const [buttonClicked, setButtonClicked] = useState(false)
    const [form, setForm] = useState({
        password: '',
        repeatPassword: ''
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { password, repeatPassword } = form
        let errorMessage: string =  '';

        if (password === '' || repeatPassword === '') errorMessage = 'All fields are mandatory'
        else if (password !== repeatPassword) errorMessage = 'Passwords are different'
        else if (password.length < 6) errorMessage = 'Password is too short'

        if(errorMessage){
           return setAlert({ msg: errorMessage, error: true });
        }
        
        if (!token) return
        setButtonClicked(true)
        const verifyToken = async () => {
            const { isValid, msg } = await TokenVerifierPass(token, form.password);
            setButtonClicked(false)
            setAlert({ msg, error: !isValid });
            if (isValid) {
                setTimeout(() => {
                    router.push('/')
                }, 2000);
            }
        };
        verifyToken()

    }


    const { msg } = alert

    return (
        <>
            {msg && <Alert alert={alert} />}
            <h1 className="text-white font-[family-name:var(--font-poiret-one)] ">Update your password and continue exploring our app.</h1>
            <div className="mt-10 w-full">
                <form className="w-full" onSubmit={handleSubmit}>
                    {msg && <Alert alert={alert} />}
                    <div className="flex flex-col">
                        <label htmlFor="password"
                            className="font-bold text-white text-xl block">
                            Password
                        </label>
                        <input id="password" type="password"
                            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
                            placeholder="Password" autoComplete="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="repeatPassword"
                            className="font-bold text-white text-xl block">
                            Repeat Password
                        </label>
                        <input id="repeatPassword" type="password"
                            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
                            placeholder="Password" autoComplete="password"
                            value={form.repeatPassword}
                            onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })} />
                    </div>
                    <div className="mt-2">
                        <Button text={"Save Password"} setButtonClicked={buttonClicked} />
                    </div>
                </form>
            </div>

        </>
    )
}

export default ConfirmNewPassword
