'use client'

import { useState, useEffect, createContext, ReactNode } from "react"
import axiosClient from "@/config/axios"
import handleApiError from "@/utils/handleApiError"


interface PasswordProps {
    currentPassword: string,
    newPassword: string
}

interface sendEmailProps {
    email: string
}

interface AuthContextProps {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
    charging: boolean;
    logOut: () => void;
    login: (email: string, password: string) => Promise<string | null>,
    register: (email: string, password: string, name: string) => Promise<string | null>,
    updateProfile: (profile: Auth) => Promise<string | null>;
    sendEmailResetPassword: (email: sendEmailProps) => Promise<string | null>;
    changePassword: (info: PasswordProps) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps>({
    auth: {
        _id: '',
        avatar: undefined,
        name: '',
        bio: '',
        phone: '',
        birthDate: undefined,
        profession: ''
    },
    setAuth: () => { },
    charging: true,
    logOut: () => { },
    login: async () => null,
    register: async () => null,
    updateProfile: async () => null,
    sendEmailResetPassword: async () => null,
    changePassword: async () => null
});

interface AuthProviderProps {
    children: ReactNode
}

interface Auth {
    _id: string,
    avatar?: {
        data: string,
        contentType: string
    } | File,
    name?: string,
    bio?: string,
    phone?: string,
    birthDate?: Date | null,
    profession?: string
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<Auth>({
        _id: '',
        avatar: undefined,
        name: '',
        bio: '',
        phone: '',
        birthDate: undefined,
        profession: ''
    });
    const [charging, setCharging] = useState(true)

    useEffect(() => {
        const authenticateUser = async () => {
            const token = localStorage.getItem('MapToken');

            if (!token) {
                setCharging(false)
                return;
            }
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await axiosClient('/profile', config)
                setAuth(data.user)

            } catch (error: unknown) {
                handleApiError(error)
                setAuth({
                    _id: '',
                    avatar: undefined,
                    name: '',
                    bio: '',
                    phone: '',
                    birthDate: undefined,
                    profession: ''
                })
            }

            setCharging(false)
        }
        authenticateUser()

    }, [])

    const login = async (email: string, password: string) => {
        try {
            const url = '/login'
            const { data } = await axiosClient.post(url, { email, password })
            localStorage.setItem('MapToken', data.token)
            setAuth(data)
            return null
        } catch (error: unknown) {
            return handleApiError(error)

        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            await axiosClient.post('/', { name, email, password })
            return null
        } catch (error) {
            return handleApiError(error)
        }
    }

    const updateProfile = async (profile: Auth) => {
        const token = localStorage.getItem('MapToken');
        if (!token) {
            setCharging(false)
            return;
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const { data } = await axiosClient.post(`/profile/${profile._id}`, profile, config)
            setAuth(data.user)
            return null
        } catch (error: unknown) {
            return handleApiError(error)
        }
    }

    const logOut = () => {
        localStorage.removeItem('MapToken')

        setAuth({
            _id: '',
            avatar: undefined,
            name: '',
            bio: '',
            phone: '',
            birthDate: undefined,
            profession: ''
        })
    }

    const sendEmailResetPassword = async ({ email }: sendEmailProps) => {
        try {
            await axiosClient.post('/resetPassword', {email})
            return null
        } catch (error: unknown) {
            return handleApiError(error)
        }

    }

    const changePassword = async (info: PasswordProps) => {
        const token = localStorage.getItem('MapToken');

        if (!token) {
            setCharging(false)
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            await axiosClient.post('/changePassword', info, config)
            return null
        } catch (error: unknown) {
            return handleApiError(error)
        }
    }

    return (
        <AuthContext.Provider value={{ auth, login, register, setAuth, charging, logOut, updateProfile, sendEmailResetPassword, changePassword }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext
