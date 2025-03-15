'use client'

import { useState, useEffect, createContext, useCallback } from "react"
import { authenticate, logout } from "@/actions/auth"
import { Auth, defaultAuth, AuthContextProps, AuthProviderProps } from "@/types/auth"


const AuthContext = createContext<AuthContextProps>({
    auth: defaultAuth,
    setAuth: () => { },
    charging: true,
    logOut: () => { },
    updateUser: async () => { },
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [charging, setCharging] = useState(true)
    const [auth, setAuth] = useState<Auth>(defaultAuth);

    const authenticateUser = useCallback(async () => {
        const { user, error } = await authenticate()
        if (error) {
            setAuth(defaultAuth)
            setCharging(false)
            return error
        }
        setAuth(user)
        setCharging(false)
    }, [])

    useEffect(() => {
        authenticateUser();
    }, [authenticateUser]);

    const updateUser = async (user: Auth) => {
        setAuth(user)
    }
    const logOut = async () => {
        await logout()
        setAuth(defaultAuth)
    }

    return (
        <AuthContext.Provider value={{ auth, updateUser, setAuth, charging, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext
