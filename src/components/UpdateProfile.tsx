import { useActionState, useEffect, useState } from "react";
import Button from "./Button";
import Alert from "./Alert";
import { handleUpdateProfile } from "@/app/(admin)/profile/updateProfileAction";
import useAuth from "@/hooks/UseAuth";
import { Auth } from "@/types/auth";

const initialState = { success: false, user: {}, error: null } as { success: boolean; user: Auth | null; error: string | null };

const ChangeProfile = () => {
    const { auth, updateUser } = useAuth();

    const [avatarExist, setAvatarExist] = useState(false)
    const [preview, setPreview] = useState<string | undefined>('')

    const [edit, setEdit] = useState(false)
    const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: null, error: false })

    const wrappedAction = async (state: typeof initialState, formData: FormData) => {
        return handleUpdateProfile(state, formData, auth._id);
    };
    const [state, formAction, isPending] = useActionState(wrappedAction, initialState)

    useEffect(() => {
        if (state?.success && state?.user) {
            updateUser(state.user);
            setAlert({
                msg: 'User Updated Successfully',
                error: false
            })
            setTimeout(() => {
                setEdit(false)
            }, 2000);
        } else if (state?.error) {
            setAlert({ msg: state.error, error: true })
        }
       
    }, [state]);

    useEffect(() => {
        const watchAvatar = () => {
            if (auth && auth.avatar && 'data' in auth.avatar && 'contentType' in auth.avatar) {
                if (auth.avatar.data && auth.avatar.contentType) {
                    setAvatarExist(true);
                }
            }
        }
        watchAvatar()
    }, [auth])

    const [profile, setProfile] = useState({
        _id: auth._id,
        avatar: auth.avatar || undefined,
        name: auth.name || '',
        bio: auth.bio || '',
        phone: auth.phone || '',
        birthDate: auth.birthDate ? new Date(auth.birthDate).toISOString().split('T')[0] : '',
        profession: auth.profession || ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]));
            setProfile({ ...profile, avatar: e.target.files[0] });
        }
        setAvatarExist(false)
    }

    const { msg } = alert

    return (

        <>
            <form action={formAction}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 ">
                    <div className="flex flex-col sm:flex-row items-center  gap-5">

                        <div className={`${edit ? 'hover:scale-110 ' : ''}  border w-[6rem] h-[6rem] transition-all ease-in-out duration-300  rounded-full shadow-xl bg-white overflow-hidden`}>
                            <label htmlFor="avatar" className="w-[6rem] h-[6rem] flex justify-center items-center">
                                {avatarExist && profile && profile.avatar && 'data' in profile.avatar && 'contentType' in profile.avatar ?
                                    <img src={`data:${profile.avatar.contentType};base64,${profile.avatar.data}`} /> : preview ? <img src={preview} alt="" className={`${edit ? 'opacity-50' : ''} hover:opacity-100 transition-all ease-out`} /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke='black' strokeLinecap="round" strokeLinejoin="round" width="48" height="48" strokeWidth="2"> <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path> <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path> </svg>}
                            </label>
                        </div>
                        <input
                            type="file"
                            disabled={edit ? false : true}
                            id="avatar"
                            name="avatar"
                            accept=".jpg, .jpeg, .png"
                            className="hidden"
                            onChange={handleChange} />

                        <div className=" flex flex-col justify-center sm:items-start items-center">
                            <h2>{profile.name}</h2>
                            <p className="text-sm text-gray-400">{profile.profession}</p>
                        </div>
                    </div>

                    <button type="button" className="border   bg-amber-400 hover:bg-gray-700 p-4 rounded-full mr-0 sm:mr-4 hover:scale-110 transition-transform ease-in-out" onClick={() => setEdit(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2"> <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path> <path d="M13.5 6.5l4 4"></path> </svg>                     </button>
                </div>

                <div className="mt-10 flex ">
                    <div className="w-full ">
                        <div className="mb-4">
                            <label htmlFor="bio" className="font-bold block"> Bio </label>
                            <textarea id="bio"
                                name="bio"
                                disabled={edit ? false : true}
                                className={`${edit ? 'bg-gray-50' : 'bg-gray-300 text-gray-500'} border p-2 mt-3 w-full rounded-lg`}
                                placeholder="Add Bio" autoComplete="bio"
                                value={profile.bio}
                                rows={2}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })} style={{
                                    resize: 'none'
                                }} />
                        </div>
                        <div className="flex justify-between sm:flex-row flex-col align-middle gap-10">
                            <div className="w-full">
                                <label htmlFor="name"
                                    className="font-bold block"> Name </label>
                                <input id="name" type="text" name="name"
                                    disabled={edit ? false : true}
                                    className={`${edit ? 'bg-gray-50' : 'bg-gray-300 text-gray-500'} border p-2 mt-3 w-full rounded-lg`}
                                    placeholder="Your Name" autoComplete="username"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

                                <label htmlFor="birthDate" className="font-bold block mt-5"> Birth Date </label>
                                <input id="birthDate" type="date" name="date"
                                    disabled={edit ? false : true}
                                    className={`${edit ? 'bg-gray-50' : 'bg-gray-300 text-gray-500'} border p-2 mt-3 w-full rounded-lg`}
                                    autoComplete="date"
                                    value={profile.birthDate}
                                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} />
                            </div>

                            <div className="w-full">
                                <label htmlFor="phone" className="font-bold  block"> Phone Number </label>
                                <input id="phone" type="text" name="phone"
                                    disabled={edit ? false : true}
                                    className={`${edit ? 'bg-gray-50' : 'bg-gray-300 text-gray-500'} border p-2 mt-3 w-full rounded-lg`}
                                    placeholder="Phone Number" autoComplete="current-password"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />

                                <label htmlFor="profession" className="font-bold mt-5 block"> Profession </label>
                                <input id="profession" type="text" name="profession"
                                    disabled={edit ? false : true}
                                    className={`${edit ? 'bg-gray-50' : 'bg-gray-300 text-gray-500'} border p-2 mt-3 w-full rounded-lg`}
                                    placeholder="Profession" autoComplete="current-password"
                                    value={profile.profession}
                                    onChange={(e) => setProfile({ ...profile, profession: e.target.value })} />
                            </div>
                        </div>
                        <div className="mt-10">
                            {edit && <Button text={'Save Changes'} setButtonClicked={isPending} />}
                            {msg && <Alert alert={alert} />}
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default ChangeProfile