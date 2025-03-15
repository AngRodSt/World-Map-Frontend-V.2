import { useActionState, useEffect } from "react"
import Alert from "./Alert"
import Button from "./Button"
import { useState } from "react"
import { handleChangePassword } from "@/app/(admin)/profile/changePasswordAction"

const initialState = { success: false, message: '', error: null }

const ChangePassword = () => {
    const [state, formAction, isPending] = useActionState(handleChangePassword, initialState)
    const [form, setForm] = useState({currentPassword: '', newPassword: ''})
    const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: '', error: false })

    useEffect(() => {
        if (state?.error) {
            setAlert({ msg: state.error, error: true })
        }
        else if (state?.success && state?.message) {
            setAlert({ msg: state.message, error: false })
            setTimeout(() => {
                setForm({ currentPassword: '', newPassword: '' })
                setAlert({ msg: '', error: false })
            }, 2000);
        }
    }, [state]);

    const { msg } = alert
    return (
        <>
            <form action={formAction} className="w-full mt-24 " >
                <div className="flex flex-col justify-center items-center">
                    <label htmlFor="currentPassword"
                        className="font-bold block"> Current Password </label>
                    <input id="currentPassword" type="password" name="currentPassword"
                        className={`'bg-gray-50'  border p-2 mt-3  lg:w-1/3 w-full  rounded-lg`}
                        placeholder="Current Password" autoComplete="username"
                        value={form.currentPassword}
                        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                        required />

                    <label htmlFor="NewPassword"
                        className="font-bold block mt-5"> New Password </label>
                    <input id="NewPassword" type="password" name="newPassword"
                        className={` 'bg-gray-50'  border p-2 mt-3  lg:w-1/3 w-full rounded-lg`}
                        placeholder="New Password" autoComplete="username"
                        value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        required />
                    <div className="mt-10 lg:w-1/3 w-full ">
                        <Button text={'Save'} setButtonClicked={isPending} />
                        {msg && <Alert alert={alert} />}
                    </div>
                </div>

            </form>
        </>)
}

export default ChangePassword


