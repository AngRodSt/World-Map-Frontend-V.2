'use client'

import { useEffect, useState } from "react"
import { useActionState } from "react";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import { handleConfirmNewPassword } from "../resetPasswordAction";

const initialState = { success: false, message: "", error: null } as { success: boolean; message: string | null; error: string | null };

const ConfirmNewPassword = () => {
    const params = useParams();
    const token = params?.token as string | undefined
    const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: null, error: false })
    const [form, setForm] = useState({ password: '', repeatPassword: '' })
    const router = useRouter()
    if (!token) {
        return setAlert({ msg: "Invalid or missing user", error: true })
    }
    /* 
     Wrapped function to match the expected signature for useActionState.
     It ensures that handleConfirmNewPassword receives the correct arguments,
     including the token, which is asserted as non-null using '!'.
     */
    const wrappedAction = async (state: typeof initialState, formData: FormData) => {
        return handleConfirmNewPassword(state, formData, token!);
    };
    const [state, formAction, isPending] = useActionState(wrappedAction, initialState)

    useEffect(() => {
        if (state?.error) {
            setAlert({ msg: state.error, error: true })
        }
        else if (state?.success && state?.message) {
            setAlert({ msg: state.message, error: false })
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    }, [state?.error, state?.message]);

    const { msg } = alert
    return (
        <>
            {msg && <Alert alert={alert} />}
            <h1 className="text-white font-[family-name:var(--font-poiret-one)] ">Update your password and continue exploring our app.</h1>
            <div className="mt-10 w-full">
                <form action={formAction} className="w-full">
                    <div className="flex flex-col">
                        <label htmlFor="password"
                            className="font-bold text-white text-xl block">
                            Password
                        </label>
                        <input id="password" type="password" name='password'
                            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
                            placeholder="Password" autoComplete="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="repeatPassword"
                            className="font-bold text-white text-xl block">
                            Repeat Password
                        </label>
                        <input id="repeatPassword" type="password" name="repeatPassword"
                            className="border p-3 mt-3 w-full bg-gray-50 rounded-lg"
                            placeholder="Password" autoComplete="password"
                            value={form.repeatPassword}
                            onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })}
                            required />
                    </div>
                    <div className="mt-2">
                        <Button text={"Save Password"} setButtonClicked={isPending} />
                    </div>
                </form>
            </div>
        </>
    )
}

export default ConfirmNewPassword
